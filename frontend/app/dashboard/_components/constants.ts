// constants.js
export const HAZARD_TYPES = {
    crack: { name: 'crack', color: '#3b82f6', desc: '도로 균열 발견' },
    pothole: { name: 'pothole', color: '#f59e0b', desc: '포트홀 위험구간' },
    debris: { name: 'debris', color: '#ef4444', desc: '도로 파편 감지' },
    water_damage: { name: 'water_damage', color: '#10b981', desc: '수해 손상구간' },
    surface_wear: { name: 'surface_wear', color: '#8b5cf6', desc: '표면 마모 심각' },
    barrier_damage: { name: 'barrier_damage', color: '#f97316', desc: '가드레일 손상' }
};

export const HAZARD_SOURCES = ['순찰차량', '검사차량', '모니터링차', '드론장비', '고정센서', 'IoT단말기'];

export const SEVERITY_LEVELS = {
    low: { color: '#22c55e', label: '낮음', range: '0-30' },
    medium: { color: '#f59e0b', label: '보통', range: '31-60' },
    high: { color: '#ef4444', label: '높음', range: '61-100' }
};

export const SEOUL_ROADS = [
    { id: 'gangnam', name: '강남대로', points: [[126.9780, 37.5665], [126.9800, 37.5550], [126.9850, 37.5400]] },
    { id: 'teheran', name: '테헤란로', points: [[126.9600, 37.5040], [126.9700, 37.5080], [126.9800, 37.5120]] },
    { id: 'olympic', name: '올림픽대로', points: [[126.8800, 37.5200], [126.9200, 37.5300], [126.9600, 37.5200]] },
    { id: 'hangang', name: '한강대로', points: [[126.9200, 37.5400], [126.9400, 37.5450], [126.9600, 37.5500]] }
];

export const MAP_BOUNDS = {
    north: 37.7,
    south: 37.4,
    east: 127.2,
    west: 126.7,
    width: 800,
    height: 400 // 높이를 줄임
};