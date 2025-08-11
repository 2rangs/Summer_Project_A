// hooks.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { generateMockData } from './utils';
import { HAZARD_TYPES, HAZARD_SOURCES } from './constants';

export const useDeviceMovement = () => {
    const updateDeviceMovement = useCallback((prevData) => {
        return prevData.map(device => {
            if (device.status !== 'active') return device;

            const now = Date.now();
            const timeDelta = (now - device.lastUpdate) / 1000;
            const moveSpeed = 0.0001;

            const [currentLng, currentLat] = device.position;
            const [targetLng, targetLat] = device.targetPosition;

            const deltaLng = targetLng - currentLng;
            const deltaLat = targetLat - currentLat;
            const distance = Math.sqrt(deltaLng * deltaLng + deltaLat * deltaLat);

            let newPosition = device.position;
            let newPathIndex = device.currentPathIndex;
            let newTargetPosition = device.targetPosition;
            let newTrail = [...device.trail];

            if (distance < 0.001) {
                newPathIndex = (device.currentPathIndex + 1) % device.path.points.length;
                newTargetPosition = device.path.points[newPathIndex];
                newPosition = device.targetPosition;
            } else {
                const moveDistance = moveSpeed * timeDelta;
                const moveRatio = Math.min(moveDistance / distance, 1);

                newPosition = [
                    currentLng + deltaLng * moveRatio,
                    currentLat + deltaLat * moveRatio
                ];
            }

            newTrail.push(newPosition);
            if (newTrail.length > 10) {
                newTrail = newTrail.slice(-10);
            }

            return {
                ...device,
                position: newPosition,
                targetPosition: newTargetPosition,
                currentPathIndex: newPathIndex,
                trail: newTrail,
                lastUpdate: now,
                value: Math.max(5, device.value + (Math.random() - 0.5) * 5),
                timestamp: new Date().toLocaleTimeString('ko-KR'),
                direction: Math.atan2(deltaLat, deltaLng) * 180 / Math.PI
            };
        });
    }, []);

    return updateDeviceMovement;
};

export const useFilteredData = (mockData, selectedHazardType, selectedSeverity) => {
    return useMemo(() => {
        return mockData.filter(item => {
            const typeMatch = selectedHazardType === 'all' || item.type === selectedHazardType;
            const severityMatch = selectedSeverity === 'all' || item.level === selectedSeverity;
            return typeMatch && severityMatch && item.status === 'active';
        });
    }, [mockData, selectedHazardType, selectedSeverity]);
};

export const useStats = (filteredData) => {
    return useMemo(() => {
        const active = filteredData.length;
        const high = filteredData.filter(d => d.level === 'high').length;
        const avgValue = Math.round(filteredData.reduce((a, b) => a + b.value, 0) / filteredData.length) || 0;
        const avgSpeed = Math.round(filteredData.reduce((a, b) => a + (b.speed || 0), 0) / filteredData.length) || 0;

        return { active, high, avgValue, avgSpeed };
    }, [filteredData]);
};

export const useChartData = (filteredData, mockData) => {
    return useMemo(() => {
        const pieData = Object.keys(HAZARD_TYPES).map(type => ({
            name: type,
            value: filteredData.filter(d => d.type === type).length,
            color: HAZARD_TYPES[type].color
        }));

        const sourceData = HAZARD_SOURCES.map(source => ({
            name: source,
            count: filteredData.filter(d => d.source === source).length,
            avgSeverity: Math.round(filteredData.filter(d => d.source === source).reduce((a, b) => a + b.value, 0) / filteredData.filter(d => d.source === source).length) || 0
        }));

        const timeSeries = mockData.slice(-30).map((d, i) => ({
            time: `${String(Math.floor(i/2)).padStart(2, '0')}:${String((i%2)*30).padStart(2, '0')}`,
            value: d.value,
            high: mockData.slice(-30).filter((item, idx) => idx <= i && item.level === 'high').length,
            medium: mockData.slice(-30).filter((item, idx) => idx <= i && item.level === 'medium').length,
            low: mockData.slice(-30).filter((item, idx) => idx <= i && item.level === 'low').length
        }));

        const radarData = Object.keys(HAZARD_TYPES).map(type => ({
            type,
            count: filteredData.filter(d => d.type === type).length,
            avgSeverity: Math.round(filteredData.filter(d => d.type === type).reduce((a, b) => a + b.value, 0) / filteredData.filter(d => d.type === type).length) || 0,
            maxValue: 100
        }));

        return { pieData, sourceData, timeSeries, radarData };
    }, [filteredData, mockData]);
};

export const useDashboardState = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [mockHazmatData, setMockHazmatData] = useState(generateMockData());
    const [selectedHazardType, setSelectedHazardType] = useState('all');
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [isRealTime, setIsRealTime] = useState(true);
    const [showMovement, setShowMovement] = useState(true);
    const [showTrails, setShowTrails] = useState(true);
    const [animationTime, setAnimationTime] = useState(0);

    const updateDeviceMovement = useDeviceMovement();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
            setAnimationTime(prev => prev + 100);

            if (isRealTime && showMovement) {
                setMockHazmatData(updateDeviceMovement);
            } else if (isRealTime) {
                setMockHazmatData(prev => prev.map(item => ({
                    ...item,
                    value: Math.max(5, item.value + (Math.random() - 0.5) * 10),
                    timestamp: new Date().toLocaleTimeString('ko-KR')
                })));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [isRealTime, showMovement, updateDeviceMovement]);

    const refreshData = useCallback(() => {
        setMockHazmatData(generateMockData());
    }, []);

    return {
        currentTime,
        mockHazmatData,
        selectedHazardType,
        setSelectedHazardType,
        selectedSeverity,
        setSelectedSeverity,
        isRealTime,
        setIsRealTime,
        showMovement,
        setShowMovement,
        showTrails,
        setShowTrails,
        animationTime,
        refreshData
    };
};