'use client';

import React, { useMemo } from 'react';
import { Navigation } from 'lucide-react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { PathLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { Legend, AttributionInfo } from './MapComponents';

const SEOUL_CENTER = { longitude: 126.9780, latitude: 37.5665 };

const SEVERITY_LEVELS = {
    low: { color: '#22c55e' },
    medium: { color: '#f59e0b' },
    high: { color: '#ef4444' },
};

const SEOUL_ROADS = [
    {
        id: 'gangnam',
        name: '강남대로',
        points: [[126.9780, 37.5665], [126.9800, 37.5550], [126.9850, 37.5400]],
    },
    {
        id: 'teheran',
        name: '테헤란로',
        points: [[126.9600, 37.5040], [126.9700, 37.5080], [126.9800, 37.5120]],
    },
];

const MapVisualization = ({
                              data,
                              showMovement,
                              showTrails,
                              animationTime,
                              filteredCount,
                          }: {
    data: any[];
    showMovement: boolean;
    showTrails: boolean;
    animationTime: number;
    filteredCount: number;
}) => {
    const roadLayer = useMemo(() => new PathLayer({
        id: 'road-layer',
        data: SEOUL_ROADS,
        getPath: d => d.points,
        getColor: () => [96, 165, 250],
        getWidth: () => 4,
        widthMinPixels: 2,
    }), []);

    const roadLabelLayer = useMemo(() => new TextLayer({
        id: 'road-label-layer',
        data: SEOUL_ROADS,
        getPosition: d => d.points[0],
        getText: d => d.name,
        getSize: 14,
        getColor: () => [240, 240, 255],
    }), []);

    const trailLayer = useMemo(() => showTrails ? new PathLayer({
        id: 'device-trail-layer',
        data,
        getPath: d => d.trail,
        getColor: () => [99, 102, 241],
        getWidth: () => 3,
        getDashArray: () => [6, 3],
    }) : null, [showTrails, data]);

    const deviceLayer = useMemo(() => new ScatterplotLayer({
        id: 'device-marker-layer',
        data,
        getPosition: d => d.position,
        getRadius: 60,
        radiusMinPixels: 6,
        getFillColor: d => {
            const hex = SEVERITY_LEVELS[d.level]?.color || '#999999';
            const [r, g, b] = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16));
            return [r, g, b];
        },
        pickable: true,
    }), [data]);

    const labelLayer = useMemo(() => new TextLayer({
        id: 'device-label-layer',
        data,
        getPosition: d => d.position,
        getText: d => d.deviceId,
        getSize: 16,
        getColor: () => [255, 255, 255],
    }), [data]);

    return (
        <div className="h-[750px] bg-slate-800/40 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden relative">
            <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
                <p className="text-xs text-slate-300">서울시 실시간 도로 위험물 분포</p>
                <p className="text-sm font-semibold">감지된 위험구간: {filteredCount}개</p>
                {showMovement && (
                    <p className="text-xs text-green-300 flex items-center gap-1 mt-1">
                        <Navigation className="w-3 h-3" />
                        단말기 이동 추적 중
                    </p>
                )}
            </div>

            <DeckGL
                initialViewState={{ ...SEOUL_CENTER, zoom: 11, pitch: 45, bearing: 0 }}
                controller
                layers={[roadLayer, roadLabelLayer, trailLayer, deviceLayer, labelLayer].filter(Boolean)}
            >
                <Map
                    reuseMaps
                    mapLib={import('maplibre-gl')}
                    mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                />
            </DeckGL>

            <Legend />
            <AttributionInfo />
        </div>
    );
};

export default MapVisualization;
