// utils.js
import { HAZARD_TYPES, HAZARD_SOURCES, SEOUL_ROADS, MAP_BOUNDS } from './constants';

export const deg2rad = (deg) => deg * (Math.PI / 180);

export const getTileNumbers = (lat, lng, zoom) => {
    const lat_rad = deg2rad(lat);
    const n = Math.pow(2, zoom);
    const x = Math.floor(n * ((lng + 180) / 360));
    const y = Math.floor(n * (1 - (Math.log(Math.tan(lat_rad) + (1 / Math.cos(lat_rad))) / Math.PI)) / 2);
    return { x, y };
};

export const latLngToPixel = (lat, lng, bounds = MAP_BOUNDS) => {
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * bounds.width;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * bounds.height;
    return { x, y };
};

// Mapbox 스타일 타일 URL (다크 테마)
export const getMapboxTileUrl = (z, x, y) => {
    return `https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/${z}/${x}/${y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;
};

// 더미 데이터 생성 (개수 줄임)
export const generateMockData = () => {
    const hazardTypeKeys = Object.keys(HAZARD_TYPES);
    const districts = ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구'];

    return Array.from({ length: 25 }, (_, i) => { // 50개에서 25개로 줄임
        const type = hazardTypeKeys[i % hazardTypeKeys.length];
        const level = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low';
        const baseValue = level === 'high' ? 70 : level === 'medium' ? 40 : 15;
        const value = Math.floor(baseValue + Math.random() * 25);

        const pathIndex = i % SEOUL_ROADS.length;
        const path = SEOUL_ROADS[pathIndex];
        const startPoint = Math.floor(Math.random() * (path.points.length - 1));
        const currentPosition = path.points[startPoint];

        return {
            id: i + 1,
            position: currentPosition,
            targetPosition: path.points[(startPoint + 1) % path.points.length],
            path: path,
            currentPathIndex: startPoint,
            type,
            level,
            value,
            deviceId: `DEV-${(i + 1).toString().padStart(3, '0')}`,
            timestamp: new Date(Date.now() - (25 - i) * 45000).toLocaleTimeString('ko-KR'),
            source: HAZARD_SOURCES[i % HAZARD_SOURCES.length],
            description: HAZARD_TYPES[type].desc,
            address: `서울특별시 ${districts[Math.floor(Math.random() * districts.length)]} 구역 ${i + 1}`,
            status: Math.random() > 0.15 ? 'active' : 'inactive', // 활성 비율 증가
            confidence: Math.floor(75 + Math.random() * 25),
            speed: Math.floor(30 + Math.random() * 50),
            direction: Math.floor(Math.random() * 360),
            lastUpdate: Date.now(),
            trail: [currentPosition],
            animationOffset: Math.random() * 100
        };
    });
};