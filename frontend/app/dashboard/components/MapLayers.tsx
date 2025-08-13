"use client";
import { useMemo } from 'react';
import { ScatterplotLayer, TextLayer, LineLayer } from '@deck.gl/layers';
import { ScanItem, ViewState } from './types';
import { MARKER, ZOOM, ANIMATION } from './constants';
import { getCoordinates } from './utils';
import { formatDateTime } from './utils';

interface MapLayersProps {
    validItems: ScanItem[];
    selectedScanId: string | null;
    viewState: ViewState;
    onMarkerClick: (info: any) => void;
}

export const useMapLayers = ({ validItems, selectedScanId, viewState, onMarkerClick }: MapLayersProps) => {
    return useMemo(() => {
        if (!validItems.length) return [];

        const isPointMode = viewState.zoom > ZOOM.POINT_MODE_MIN;
        const regular = validItems.filter((it) => it.scan_id !== selectedScanId);
        const selected = validItems.find((it) => it.scan_id === selectedScanId);

        const list: any[] = [];

        if (isPointMode) {
            if (regular.length) {
                list.push(
                    new ScatterplotLayer<ScanItem>({
                        id: "points-regular",
                        data: regular,
                        getPosition: getCoordinates,
                        getFillColor: MARKER.REGULAR.fillColor,
                        lineWidthMinPixels: 0,
                        stroked: true,
                        getLineColor: [34, 197, 94, 100],
                        getLineWidth: 1,
                        filled: true,
                        radiusMinPixels: 0,
                        getRadius: MARKER.REGULAR.radius,
                        pickable: true,
                        onClick: onMarkerClick,
                        transitions: {
                            getPosition: ANIMATION.MARKER_TRANSITION,
                            getFillColor: 400,
                            getRadius: 400,
                        },
                    })
                );
            }

            if (selected) {
                list.push(
                    new ScatterplotLayer<ScanItem>({
                        id: "points-selected",
                        data: [selected],
                        getPosition: getCoordinates,
                        getFillColor: MARKER.SELECTED.fillColor,
                        stroked: true,
                        getLineColor: [255, 255, 255, 200],
                        getLineWidth: 2,
                        filled: true,
                        getRadius: MARKER.SELECTED.radius,
                        pickable: true,
                        onClick: onMarkerClick,
                        transitions: {
                            getPosition: ANIMATION.MARKER_TRANSITION,
                            getFillColor: 400,
                            getRadius: 400,
                        },
                    })
                );

                list.push(
                    new ScatterplotLayer<ScanItem>({
                        id: "points-selected-glow",
                        data: [selected],
                        getPosition: getCoordinates,
                        getFillColor: [239, 68, 68, 50],
                        stroked: false,
                        filled: true,
                        getRadius: MARKER.SELECTED.radius * 2,
                        pickable: false,
                        transitions: { getPosition: ANIMATION.MARKER_TRANSITION },
                    })
                );
            }
        } else {
            const sorted = [...validItems].sort(
                (a, b) =>
                    new Date(a.capture_dt ?? 0).getTime() -
                    new Date(b.capture_dt ?? 0).getTime()
            );

            if (sorted.length > 1) {
                const lineData = [];
                for (let i = 0; i < sorted.length - 1; i++) {
                    const s = getCoordinates(sorted[i]);
                    const t = getCoordinates(sorted[i + 1]);
                    lineData.push({
                        sourcePosition: s,
                        targetPosition: t,
                        color:
                            sorted[i].scan_id === selectedScanId ||
                            sorted[i + 1].scan_id === selectedScanId
                                ? [239, 68, 68, 200]
                                : [34, 197, 94, 120],
                    });
                }
                list.push(
                    new LineLayer<any>({
                        id: "path",
                        data: lineData,
                        getSourcePosition: (d) => d.sourcePosition,
                        getTargetPosition: (d) => d.targetPosition,
                        getColor: (d) => d.color,
                        getWidth: 3,
                        pickable: false,
                        transitions: { getSourcePosition: 800, getTargetPosition: 800 },
                    })
                );
            }

            const step = Math.max(1, Math.floor(sorted.length / 20));
            const keyPoints = sorted.filter((_, i) => i % step === 0);
            list.push(
                new ScatterplotLayer<ScanItem>({
                    id: "key-points",
                    data: keyPoints,
                    getPosition: getCoordinates,
                    getFillColor: (d) =>
                        d.scan_id === selectedScanId
                            ? MARKER.SELECTED.fillColor
                            : MARKER.REGULAR.fillColor,
                    stroked: true,
                    getLineColor: [255, 255, 255, 180],
                    getLineWidth: 1,
                    filled: true,
                    getRadius: (d) =>
                        d.scan_id === selectedScanId
                            ? Math.max(6, MARKER.SELECTED.radius - 1)
                            : Math.max(3, MARKER.REGULAR.radius - 1),
                    radiusMinPixels: 0,
                    pickable: true,
                    onClick: onMarkerClick,
                })
            );
        }

        if (selected && viewState.zoom > ZOOM.POINT_MODE_MIN) {
            list.push(
                new TextLayer<ScanItem>({
                    id: "selected-label",
                    data: [selected],
                    getPosition: getCoordinates,
                    getText: (d) => formatDateTime(d.capture_dt),
                    getSize: 12,
                    sizeUnits: "pixels",
                    getColor: [255, 255, 255, 220],
                    getTextAnchor: "start",
                    getAlignmentBaseline: "bottom",
                    background: true,
                    getBackgroundColor: [0, 0, 0, 160],
                    backgroundPadding: [4, 6],
                    billboard: true,
                })
            );
        }

        return list;
    }, [validItems, selectedScanId, viewState.zoom, onMarkerClick]);
};
