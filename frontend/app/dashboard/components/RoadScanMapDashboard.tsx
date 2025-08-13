"use client";
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { DeckGL } from "@deck.gl/react";
import { Map } from "react-map-gl/maplibre";
import { SystemStatusPanel } from './SystemStatusPanel';
import { DateFilterPanel } from './DateFilterPanel';
import { NavigationControls } from './NavigationControls';
import { DetailPanel } from './DetailPanel';
import { useMapLayers } from './MapLayers';
import { useApiList, useScanDetail } from './hooks';
import { getCoordinates, isValidCoordinatePair, formatDate, getDateKey } from './utils';
import { DEFAULT_CENTER, ANIMATION, MAP_STYLE } from './constants';
import { ViewState, ScanItem, DateGroup } from './types';

export default function RoadScanMapDashboard() {
    const { resp, error, loading } = useApiList();
    const { detail, loading: detailLoading, error: detailError, fetchDetail, reset: resetDetail } = useScanDetail();

    const [viewState, setViewState] = useState<ViewState>({
        longitude: DEFAULT_CENTER.lon,
        latitude: DEFAULT_CENTER.lat,
        zoom: 11,
        pitch: 45,
        bearing: 0,
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("all");
    const [isStatusMinimized, setIsStatusMinimized] = useState(false);
    const [isDateFilterMinimized, setIsDateFilterMinimized] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const items: ScanItem[] = useMemo(() => resp?.data?.items ?? [], [resp?.data?.items]);

    const dateGroups: DateGroup[] = useMemo(() => {
        const grouped: Record<string, ScanItem[]> = {};
        for (const it of items) {
            const key = getDateKey(it.capture_dt);
            if (!key) continue;
            (grouped[key] ||= []).push(it);
        }
        return Object.entries(grouped)
            .map(([date, list]) => ({
                date,
                displayDate: formatDate(date),
                items: list,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [items]);

    const filteredItems = useMemo<ScanItem[]>(() => {
        if (selectedDate === "all") return items;
        const g = dateGroups.find((x) => x.date === selectedDate);
        return g?.items ?? [];
    }, [items, dateGroups, selectedDate]);

    const validItems = useMemo(() => {
        return filteredItems.filter((it) => {
            const [lon, lat] = getCoordinates(it);
            return isValidCoordinatePair(lon, lat);
        });
    }, [filteredItems]);

    const navigateToIndex = useCallback(
        (index: number) => {
            if (!validItems.length) return;
            const i = (index + validItems.length) % validItems.length;
            const item = validItems[i];
            if (!item?.scan_id) return;

            setCurrentIndex(i);
            setSelectedScanId(item.scan_id);
            setShowDetail(true);
            fetchDetail(item.scan_id);

            const [lon, lat] = getCoordinates(item);
            if (isValidCoordinatePair(lon, lat)) {
                setViewState((vs) => ({
                    ...vs,
                    longitude: lon,
                    latitude: lat,
                    zoom: Math.max(vs.zoom, 15),
                    transitionDuration: ANIMATION.MAP_TRANSITION,
                }));
            }
        },
        [validItems, fetchDetail]
    );

    const goPrev = useCallback(() => {
        if (validItems.length === 0) return;
        navigateToIndex(currentIndex - 1);
    }, [currentIndex, validItems.length, navigateToIndex]);

    const goNext = useCallback(() => {
        if (validItems.length === 0) return;
        navigateToIndex(currentIndex + 1);
    }, [currentIndex, validItems.length, navigateToIndex]);

    const onMarkerClick = useCallback(
        (info: any) => {
            const id: string | undefined = info?.object?.scan_id;
            if (!id) return;
            const idx = validItems.findIndex((x) => x.scan_id === id);
            if (idx >= 0) navigateToIndex(idx);
        },
        [validItems, navigateToIndex]
    );

    const togglePlay = useCallback(() => {
        setIsPlaying((v) => !v);
    }, []);

    const closeDetail = useCallback(() => {
        setShowDetail(false);
        setSelectedScanId(null);
        resetDetail();
    }, [resetDetail]);

    const onDateSelect = useCallback(
        (d: string) => {
            setSelectedDate(d);
            setCurrentIndex(0);
            setIsPlaying(false);
            closeDetail();
        },
        [closeDetail]
    );

    const layers = useMapLayers({
        validItems,
        selectedScanId,
        viewState,
        onMarkerClick,
    });

    // Auto-play management
    useEffect(() => {
        if (!isPlaying || validItems.length === 0) return;
        const base = ANIMATION.PLAYBACK_INTERVAL_MS;
        const delay = base / Math.max(0.25, playbackSpeed);
        intervalRef.current = setInterval(() => {
            goNext();
        }, delay);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isPlaying, playbackSpeed, validItems.length, goNext]);

    // Reset on date change
    useEffect(() => {
        if (validItems.length > 0) {
            navigateToIndex(0);
        } else {
            setShowDetail(false);
            setSelectedScanId(null);
            resetDetail();
        }
    }, [selectedDate, validItems.length, navigateToIndex, resetDetail]);

    // Keyboard shortcuts
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
            } else if (e.key === " ") {
                e.preventDefault();
                togglePlay();
            } else if (e.key === "Escape") {
                e.preventDefault();
                setShowDetail(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [goPrev, goNext, togglePlay]);

    const onSpeedChange = useCallback((n: number) => {
        setPlaybackSpeed(n);
    }, []);

    return (
        <div style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            background: "#0b1020",
        }}>
            <DeckGL
                layers={layers}
                viewState={viewState}
                controller={{ dragRotate: true, inertia: 200 }}
                onViewStateChange={({ viewState: vs }: any) => setViewState(vs)}
            >
                <Map mapStyle={MAP_STYLE} />
            </DeckGL>

            <SystemStatusPanel
                error={error}
                loading={loading}
                resp={resp}
                isMinimized={isStatusMinimized}
                onToggleMinimize={() => setIsStatusMinimized((v) => !v)}
            />

            <DateFilterPanel
                dateGroups={dateGroups}
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
                isMinimized={isDateFilterMinimized}
                onToggleMinimize={() => setIsDateFilterMinimized((v) => !v)}
            />

            <NavigationControls
                currentIndex={validItems.length ? currentIndex : 0}
                totalItems={validItems.length}
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                onPrevious={goPrev}
                onNext={goNext}
                onPlayPause={togglePlay}
                onSpeedChange={onSpeedChange}
                selectedDate={selectedDate}
            />

            {showDetail && (
                <DetailPanel
                    detail={detail}
                    loading={detailLoading}
                    error={detailError}
                    onClose={closeDetail}
                    currentZoom={viewState.zoom}
                />
            )}
        </div>
    );