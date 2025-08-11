'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { DeckGL } from '@deck.gl/react';
import { PathLayer, IconLayer } from '@deck.gl/layers';
import type { Position } from '@turf/helpers';

const INITIAL_VIEW_STATE = {
    longitude: 127.024612,
    latitude: 37.5326,
    zoom: 13,
    pitch: 45,
    bearing: 0
};

type DeviceData = {
    longitude: number;
    latitude: number;
    timestamp: number;
};

export default function MapPage() {
    const pathRef = useRef<Position[]>([]);
    const [latest, setLatest] = useState<Position | null>(null);

    useEffect(() => {
        const source = new EventSource('http://localhost:8000/stream/device_1');

        source.onmessage = (event) => {
            try {
                const data: DeviceData = JSON.parse(event.data);
                const newPoint: Position = [data.longitude, data.latitude];

                pathRef.current.push(newPoint);
                if (pathRef.current.length > 50) {
                    pathRef.current.shift();
                }

                setLatest(newPoint); // 리렌더 유도
            } catch (e) {
                console.error('Invalid data from server:', event.data);
            }
        };

        source.onerror = (e) => {
            console.error('SSE connection error:', e);
            source.close();
        };

        return () => {
            source.close();
        };
    }, []);

    const layers = useMemo(() => {
        const result = [];

        if (pathRef.current.length > 0) {
            result.push(
                new PathLayer({
                    id: 'path',
                    data: [{ path: [...pathRef.current] }],
                    getPath: d => d.path,
                    getWidth: 4,
                    getColor: [255, 0, 0],
                    widthMinPixels: 2
                })
            );
        }

        if (latest) {
            result.push(
                new IconLayer({
                    id: 'marker',
                    data: [{ position: latest }],
                    getPosition: d => d.position,
                    getSize: 3,
                    sizeUnits: 'pixels',
                    getIcon: () => ({
                        url: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                        width: 128,
                        height: 128,
                        anchorY: 128
                    }),
                    getSizeScale: 10,
                    pickable: true
                })
            );
        }

        return result;
    }, [latest]);

    return (
        <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            layers={layers}
        >
            <Map
                reuseMaps
                mapLib={import('maplibre-gl')}
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                style={{ width: '100%', height: '100vh' }}
            />
        </DeckGL>
    );
}
