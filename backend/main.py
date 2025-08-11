from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import os
import asyncio
import time
import random

app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 저장 경로
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)
PATHS_FILE = os.path.join(DATA_DIR, "paths.json")
ROAD_PATHS_FILE = os.path.join(DATA_DIR, "road-paths.json")


@app.get("/api/road-paths")
def get_road_paths():
    if not os.path.exists(ROAD_PATHS_FILE):
        raise HTTPException(status_code=404, detail="Road paths file not found.")
    with open(ROAD_PATHS_FILE, "r") as f:
        data = json.load(f)
    return JSONResponse(content=data)

# 전역 변수로 차량 위치를 저장하여 상태를 유지
vehicle_positions = {}

@app.get("/api/vehicles")
def get_vehicles():
    if not os.path.exists(ROAD_PATHS_FILE):
        raise HTTPException(status_code=404, detail="Road paths file not found.")

    with open(ROAD_PATHS_FILE, "r") as f:
        road_data = json.load(f)

    features = []
    for i, feature in enumerate(road_data["features"]):
        path_id = f"path_{i}"
        coordinates = feature["geometry"]["coordinates"]

        if path_id not in vehicle_positions:
            # 차량 초기 위치 설정
            vehicle_positions[path_id] = {
                "index": 0
            }

        # 인덱스를 1씩 증가시켜 차량 이동 시뮬레이션
        current_index = vehicle_positions[path_id]["index"]
        next_index = (current_index + 1) % len(coordinates)
        vehicle_positions[path_id]["index"] = next_index

        # 현재 위치
        current_pos = coordinates[next_index]

        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": current_pos
            },
            "properties": {
                "vehicle_id": f"vehicle_{i}",
                "timestamp": time.time()
            }
        })

    return JSONResponse(content={
        "type": "FeatureCollection",
        "features": features
    })


@app.get("/generate-path")
def generate_path(
        device_id: str = Query(..., description="디바이스 ID"),
        coords: str = Query(..., description="lon,lat;lon,lat;... 형식")
):
    """
    실제 도로 경로 (OSRM) 요청 후 paths.json에 저장
    """
    url = f"http://router.project-osrm.org/route/v1/driving/{coords}?overview=full&geometries=geojson"
    try:
        res = requests.get(url, timeout=10)
        data = res.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OSRM 요청 실패: {str(e)}")

    if data.get("code") != "Ok":
        raise HTTPException(status_code=500, detail="OSRM 응답 오류")

    path_coords = data["routes"][0]["geometry"]["coordinates"]

    if path_coords[0] != path_coords[-1]:
        path_coords.append(path_coords[0])

    if os.path.exists(PATHS_FILE):
        with open(PATHS_FILE, "r") as f:
            paths = json.load(f)
    else:
        paths = {}

    paths[device_id] = path_coords

    with open(PATHS_FILE, "w") as f:
        json.dump(paths, f, ensure_ascii=False, indent=2)

    return JSONResponse({
        "message": f"{device_id} 경로 저장 완료",
        "points": len(path_coords),
        "first": path_coords[0],
        "last": path_coords[-1]
    })


# ✅ SSE 이벤트 생성기
async def event_generator(device_id: str):
    # paths.json 로드
    if not os.path.exists(PATHS_FILE):
        raise HTTPException(status_code=404, detail="paths.json 없음")

    with open(PATHS_FILE, "r") as f:
        paths = json.load(f)

    if device_id not in paths:
        raise HTTPException(status_code=404, detail="디바이스 경로 없음")

    path = paths[device_id]
    idx = 0

    try:
        while True:
            lon, lat = path[idx % len(path)]
            payload = {
                "device_id": device_id,
                "longitude": lon,
                "latitude": lat,
                "timestamp": time.time()
            }
            yield f"data: {json.dumps(payload)}\n\n"
            idx += 1
    except asyncio.CancelledError:
        print(f"[{device_id}] SSE 종료됨")


@app.get("/stream/{device_id}")
async def stream(device_id: str):
    return StreamingResponse(
        event_generator(device_id),
        media_type="text/event-stream"
    )
