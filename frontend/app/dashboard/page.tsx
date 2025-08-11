"use client"
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    X,
    MapPin,
    Calendar,
    Camera,
    Cpu,
    Activity,
    BarChart3,
    Settings,
    Target,
    Eye,
    Clock,
    Map as MapIcon,
    Layers,
    Zap,
    Navigation
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ScanItem {
    scan_id?: string;
    capture_dt?: string;
    lat?: number;
    lot?: number;
    link_lat?: number;
    link_lot?: number;
    road_img_file_nm?: string;
    dvc_id?: string;
    [key: string]: any;
}

interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
    transitionDuration?: number;
    transitionInterpolator?: any;
}

interface ScanResponse {
    code: number;
    message: string;
    data: {
        total: number;
        count: number;
        items: ScanItem[];
    };
    errors?: any;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SEOUL_CENTER = { latitude: 37.5665, longitude: 126.9780 };
const DEFAULT_CENTER = { lat: 47.369821, lon: -122.03415 };

const API_CONFIG = {
    BASE_URL: 'https://roadmonitor.riaas.io/api/v2',
    IMAGE_BASE_URL: 'https://roadmonitor.gcdn.ntruss.com',
    TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYTZiN2JhMjktNWI4YS00NzQ2LWI3NjMtYmY1MzlhNzc5Mzg3IiwiZXhwIjoxNzU1NTA0NjI3LCJzdWIiOiJkbmEwM0ByaWFhcy5haSIsInVzZXJfaWQiOjI1OSwidXNlcl9ubSI6ImRuYTAzIiwiY3VzdF9pZCI6ODcsImpicHNfbm0iOm51bGwsImNucGwiOm51bGwsImFkbWluX3luIjoiTiIsIm9wcnRyX3luIjoiTiIsInRtX3pvbmUiOiJBbWVyaWNhL0xvc19BbmdlbGVzIiwibG9jYWxlX2NkIjoiZW5fVVMiLCJ1dGNfb2Zmc2V0IjoiLTA3OjAwIiwibGduX2F0dGVtcHRfY250IjowLCJsYXN0X2xnbl9kdCI6IjIwMjUtMDgtMTEgMDg6MDg6NTIuNzIyMTk4KzAwOjAwIiwicHN3ZF9zdHRzX2NkIjowLCJwc3dkX21kZmNuX2R0IjoiMjAyNS0wNy0xNiAwODoyNDowMC4wMjAzNDYrMDA6MDAifQ.3HNXc6O3Ha1zmX0Xq6Dwghj8djDf229ZDjgfdKlESog',
    CUSTOMER_ID: '87',
    DATE_RANGE: {
        START: '2025-07-20T00:00:00',
        END: '2025-07-26T23:59:59'
    }
};

const ANIMATION_CONFIG = {
    MAP_TRANSITION_DURATION: 800,
    IMAGE_TRANSITION_DURATION: 300,
    MARKER_TRANSITION_DURATION: 600,
    PLAYBACK_INTERVAL: 2000
};

const MARKER_STYLES = {
    REGULAR: {
        fillColor: [94, 234, 212, 200] as [number, number, number, number],
        lineColor: [255, 255, 255, 180] as [number, number, number, number],
        radius: 1
    },
    SELECTED: {
        fillColor: [255, 107, 107, 255] as [number, number, number, number],
        lineColor: [255, 255, 255, 255] as [number, number, number, number],
        radius: 2
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDateTime = (dateStr: string): string => {
    try {
        return new Date(dateStr).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateStr || '-';
    }
};

const getCoordinates = (item: ScanItem): [number, number] => {
    const lon = Number(item.link_lot ?? item.lot);
    const lat = Number(item.link_lat ?? item.lat);
    return [lon, lat];
};

const isValidCoordinate = (coord: number): boolean => {
    return isFinite(coord) && !isNaN(coord) && coord !== 0;
};

const getImageUrl = (fileName: string): string => {
    return fileName.startsWith('http')
        ? fileName
        : `${API_CONFIG.IMAGE_BASE_URL}/${fileName}`;
};

// ============================================================================
// STYLES
// ============================================================================

const createGlassCard = (): React.CSSProperties => ({
    background: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    color: 'white',
});

const createButtonStyle = (variant: 'primary' | 'secondary' | 'danger' = 'secondary'): React.CSSProperties => {
    const variants = {
        primary: 'rgba(16, 185, 129, 0.25)',
        secondary: 'rgba(59, 130, 246, 0.15)',
        danger: 'rgba(239, 68, 68, 0.15)'
    };

    return {
        padding: '10px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        background: variants[variant],
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        userSelect: 'none'
    };
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useApiData = () => {
    const [scansResp, setScansResp] = useState<ScanResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchScans = async () => {
            try {
                setLoading(true);
                const url = new URL(`${API_CONFIG.BASE_URL}/scans/simple`);
                url.searchParams.set('cust_id', API_CONFIG.CUSTOMER_ID);
                url.searchParams.set('bgng_dt', API_CONFIG.DATE_RANGE.START);
                url.searchParams.set('end_dt', API_CONFIG.DATE_RANGE.END);
                url.searchParams.set('limit', '100000');

                const response = await fetch(url.toString(), {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();
                setScansResp(data);
            } catch (e: any) {
                if (e.name !== 'AbortError') {
                    setError(String(e));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchScans();
        return () => controller.abort();
    }, []);

    return { scansResp, error, loading };
};

const useScanDetail = () => {
    const [scanDetail, setScanDetail] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchScanDetail = useCallback(async (scanId: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/scans/${encodeURIComponent(scanId)}`,
                { headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` } }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            setScanDetail(data);
        } catch (e: any) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    }, []);

    return { scanDetail, loading, error, fetchScanDetail, setScanDetail };
};

// ============================================================================
// COMPONENTS
// ============================================================================

const SystemStatusPanel: React.FC<{
    error: string | null;
    loading: boolean;
    scansResp: ScanResponse | null;
}> = ({ error, loading, scansResp }) => {
    const renderStatusContent = () => {
        if (error) {
            return (
                <div style={{
                    color: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    에러: {error}
                </div>
            );
        }

        if (loading) {
            return (
                <div style={{
                    color: '#06b6d4',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(6, 182, 212, 0.3)',
                        borderTopColor: '#06b6d4',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    데이터 로딩 중...
                </div>
            );
        }

        return (
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ color: '#10b981', marginBottom: '8px', fontWeight: '600' }}>
                        연결 상태
                    </div>
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        ✓ 정상 연결됨
                    </div>
                </div>
                <div>
                    <div style={{ color: '#06b6d4', marginBottom: '8px', fontWeight: '600' }}>
                        API 응답
                    </div>
                    <pre style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        background: 'rgba(0, 0, 0, 0.3)',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        fontSize: '11px'
                    }}>
                        {JSON.stringify({
                            code: scansResp?.code,
                            message: scansResp?.message,
                            total: scansResp?.data?.total,
                            count: scansResp?.data?.count
                        }, null, 2)}
                    </pre>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            ...createGlassCard(),
            position: 'absolute',
            zIndex: 10,
            top: '20px',
            left: '20px',
            width: '380px',
            maxHeight: '60vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                padding: '20px 24px 16px',
                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <BarChart3 size={18} style={{ color: '#06b6d4' }} />
                <span style={{ fontSize: '15px', fontWeight: '600' }}>시스템 상태</span>
            </div>

            <div style={{
                padding: '16px 24px',
                overflow: 'auto',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '12px',
                lineHeight: '1.6'
            }}>
                {renderStatusContent()}
            </div>
        </div>
    );
};

const NavigationControls: React.FC<{
    currentIndex: number;
    totalItems: number;
    isPlaying: boolean;
    playbackSpeed: number;
    onPrevious: () => void;
    onNext: () => void;
    onPlayPause: () => void;
    onSpeedChange: (speed: number) => void;
}> = ({ currentIndex, totalItems, isPlaying, playbackSpeed, onPrevious, onNext, onPlayPause, onSpeedChange }) => {
    return (
        <div style={{
            ...createGlassCard(),
            position: 'absolute',
            zIndex: 10,
            bottom: '20px',
            right: '20px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        }}>
            <button onClick={onPrevious} style={createButtonStyle('secondary')}>
                <ChevronLeft size={16} />
            </button>

            <button onClick={onPlayPause} style={createButtonStyle(isPlaying ? 'danger' : 'primary')}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? '정지' : '재생'}
            </button>

            <button onClick={onNext} style={createButtonStyle('secondary')}>
                <ChevronRight size={16} />
            </button>

            <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
                minWidth: '80px',
                textAlign: 'center'
            }}>
                {currentIndex + 1} / {totalItems}
            </div>

            <select
                value={playbackSpeed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '6px 12px',
                    fontSize: '13px'
                }}
            >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
            </select>
        </div>
    );
};

const DetailPanel: React.FC<{
    scanDetail: any;
    loading: boolean;
    error: string | null;
    onClose: () => void;
}> = ({ scanDetail, loading, error, onClose }) => {
    if (!scanDetail && !loading && !error) return null;

    return (
        <div style={{
            ...createGlassCard(),
            position: 'absolute',
            zIndex: 10,
            top: '20px',
            right: '20px',
            width: '400px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                padding: '20px 24px 16px',
                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Target size={18} style={{ color: '#06b6d4' }} />
                    <span style={{ fontSize: '15px', fontWeight: '600' }}>스캔 상세</span>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        ...createButtonStyle('danger'),
                        padding: '6px'
                    }}
                >
                    <X size={16} />
                </button>
            </div>

            <div style={{
                padding: '20px 24px',
                overflow: 'auto',
                fontSize: '14px',
                lineHeight: '1.6'
            }}>
                {error && (
                    <div style={{
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        에러: {error}
                    </div>
                )}

                {scanDetail && (
                    <>
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '16px',
                            border: '1px solid rgba(148, 163, 184, 0.1)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '12px',
                                color: '#06b6d4',
                                fontWeight: '600'
                            }}>
                                <Activity size={16} />
                                스캔 정보
                            </div>

                            <div style={{ display: 'grid', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>시간:</span>
                                    <span>{formatDateTime(scanDetail?.data?.capture_dt)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>위치:</span>
                                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '12px' }}>
                                        {(scanDetail?.data?.link_lat ?? scanDetail?.data?.lat)?.toFixed(6) ?? '-'},
                                        {(scanDetail?.data?.link_lot ?? scanDetail?.data?.lot)?.toFixed(6) ?? '-'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>디바이스:</span>
                                    <span style={{
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        fontSize: '12px'
                                    }}>
                                        {scanDetail?.data?.dvc_id ?? '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {scanDetail?.data?.road_img_file_nm && (
                            <div style={{
                                background: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: '12px',
                                padding: '16px',
                                marginBottom: '16px',
                                border: '1px solid rgba(148, 163, 184, 0.1)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '12px',
                                    color: '#06b6d4',
                                    fontWeight: '600'
                                }}>
                                    <Camera size={16} />
                                    도로 이미지
                                </div>

                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '200px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    background: 'rgba(0, 0, 0, 0.3)'
                                }}>
                                    <img
                                        src={getImageUrl(scanDetail.data.road_img_file_nm)}
                                        alt="도로 스캔 이미지"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `
                                                    <div style="
                                                        display: flex; 
                                                        align-items: center; 
                                                        justify-content: center; 
                                                        height: 100%; 
                                                        color: rgba(255, 255, 255, 0.5);
                                                        flex-direction: column;
                                                        gap: 8px;
                                                    ">
                                                        <div style="opacity: 0.3;">📷</div>
                                                        <div>이미지를 불러올 수 없습니다</div>
                                                    </div>
                                                `;
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div style={{
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid rgba(148, 163, 184, 0.1)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '12px',
                                color: '#06b6d4',
                                fontWeight: '600'
                            }}>
                                <Settings size={16} />
                                원시 데이터
                            </div>

                            <pre style={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                                fontSize: '10px',
                                lineHeight: '1.4',
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                                background: 'rgba(0, 0, 0, 0.4)',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid rgba(148, 163, 184, 0.1)',
                                color: 'rgba(255, 255, 255, 0.8)',
                                maxHeight: '200px',
                                overflow: 'auto'
                            }}>
                                {JSON.stringify(scanDetail, null, 2)}
                            </pre>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function RoadScanMapDashboard() {
    const { scansResp, error, loading } = useApiData();
    const { scanDetail, loading: detailLoading, error: detailError, fetchScanDetail, setScanDetail } = useScanDetail();

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

    const items: ScanItem[] = useMemo(() => scansResp?.data?.items ?? [], [scansResp]);

    // Filter valid items for map display
    const validItems = useMemo(() =>
        items.filter(item => {
            const [lon, lat] = getCoordinates(item);
            return isValidCoordinate(lon) && isValidCoordinate(lat);
        }), [items]
    );

    // Navigation functions
    const navigateToItem = useCallback((index: number) => {
        if (items.length === 0) return;

        const item = items[index];
        if (!item?.scan_id) return;

        setCurrentIndex(index);
        setSelectedScanId(item.scan_id);
        setShowDetail(true);
        fetchScanDetail(item.scan_id);

        const [lon, lat] = getCoordinates(item);
        if (isValidCoordinate(lon) && isValidCoordinate(lat)) {
            setViewState(vs => ({
                ...vs,
                longitude: lon,
                latitude: lat,
                zoom: Math.max(vs.zoom, 14),
                transitionDuration: ANIMATION_CONFIG.MAP_TRANSITION_DURATION
            }));
        }
    }, [items, fetchScanDetail]);

    const goToPrevious = useCallback(() => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        navigateToItem(newIndex);
    }, [currentIndex, items.length, navigateToItem]);

    const goToNext = useCallback(() => {
        const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        navigateToItem(newIndex);
    }, [currentIndex, items.length, navigateToItem]);

    const handleMarkerClick = useCallback((info: any) => {
        if (!info.object?.scan_id) return;
        const actualIndex = items.findIndex(item => item.scan_id === info.object.scan_id);
        if (actualIndex >= 0) {
            navigateToItem(actualIndex);
        }
    }, [items, navigateToItem]);

    const handlePlayPause = useCallback(() => {
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const handleCloseDetail = useCallback(() => {
        setShowDetail(false);
        setSelectedScanId(null);
        setScanDetail(null);
    }, [setScanDetail]);

    // Create DeckGL layers
    const layers = useMemo(() => {
        if (!validItems.length) return [];

        const regularItems = validItems.filter(item => item.scan_id !== selectedScanId);
        const selectedItem = validItems.find(item => item.scan_id === selectedScanId);

        const layersArray = [];

        // Regular markers layer
        if (regularItems.length > 0) {
            layersArray.push(
                new ScatterplotLayer({
                    id: 'scans-points-regular',
                    data: regularItems,
                    getPosition: getCoordinates,
                    getFillColor: MARKER_STYLES.REGULAR.fillColor,
                    lineWidthMinPixels: 0,
                    stroked: false,
                    filled: true,
                    radiusMinPixels: 0,
                    getRadius: MARKER_STYLES.REGULAR.radius,
                    pickable: true,
                    onClick: handleMarkerClick,
                    transitions: {
                        getPosition: {
                            duration: ANIMATION_CONFIG.MARKER_TRANSITION_DURATION,
                            easing: (t: number) => t * t * (3.0 - 2.0 * t)
                        },
                        getFillColor: 300,
                        getRadius: 300
                    }
                })
            );
        }

        // Selected marker layer
        if (selectedItem) {
            layersArray.push(
                new ScatterplotLayer({
                    id: 'scans-points-selected',
                    data: [selectedItem],
                    getPosition: getCoordinates,
                    getFillColor: MARKER_STYLES.SELECTED.fillColor,
                    stroked: false,
                    filled: true,
                    getRadius: MARKER_STYLES.SELECTED.radius,
                    pickable: true,
                    onClick: handleMarkerClick,
                    transitions: {
                        getPosition: {
                            duration: ANIMATION_CONFIG.MARKER_TRANSITION_DURATION,
                            easing: (t: number) => t * t * (3.0 - 2.0 * t)
                        },
                        getFillColor: 300,
                        getRadius: 300
                    }
                })
            );

        }

        return layersArray;
    }, [validItems, selectedScanId, handleMarkerClick]);

    // Auto-play effect
    useEffect(() => {
        if (!isPlaying || items.length === 0) return;

        const interval = setInterval(() => {
            goToNext();
        }, ANIMATION_CONFIG.PLAYBACK_INTERVAL / playbackSpeed);

        return () => clearInterval(interval);
    }, [isPlaying, playbackSpeed, goToNext, items.length]);

    // Auto-center on first valid coordinate
    useEffect(() => {
        if (!validItems.length) return;

        const firstItem = validItems[0];
        if (firstItem) {
            const [lon, lat] = getCoordinates(firstItem);
            setViewState(vs => ({
                ...vs,
                longitude: lon,
                latitude: lat,
                zoom: 14
            }));
        }
    }, [validItems]);

    // Initialize with first item
    useEffect(() => {
        if (items.length > 0 && !selectedScanId) {
            navigateToItem(0);
        }
    }, [items, selectedScanId, navigateToItem]);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* DeckGL Map */}
            <DeckGL
                initialViewState={{
                    ...SEOUL_CENTER,
                    zoom: 11,
                    pitch: 45,
                    bearing: 0
                }}
                viewState={viewState}
                onViewStateChange={({ viewState }) => setViewState(viewState)}
                controller={{
                    touchRotate: true,
                    touchZoom: true,
                    doubleClickZoom: true,
                    keyboard: true
                }}
                layers={layers}
                getCursor={() => 'default'}
            >
                <Map
                    reuseMaps
                    mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                />
            </DeckGL>

            {/* System Status Panel */}
            <SystemStatusPanel
                error={error}
                loading={loading}
                scansResp={scansResp}
            />

            {/* Navigation Controls */}
            {items.length > 0 && (
                <NavigationControls
                    currentIndex={currentIndex}
                    totalItems={items.length}
                    isPlaying={isPlaying}
                    playbackSpeed={playbackSpeed}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                    onPlayPause={handlePlayPause}
                    onSpeedChange={setPlaybackSpeed}
                />
            )}

            {/* Detail Panel */}
            {showDetail && (
                <DetailPanel
                    scanDetail={scanDetail}
                    loading={detailLoading}
                    error={detailError}
                    onClose={handleCloseDetail}
                />
            )}

            {/* Global Loading Overlay */}
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '500'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        background: 'rgba(15, 23, 42, 0.9)',
                        padding: '24px 32px',
                        borderRadius: '16px',
                        border: '1px solid rgba(148, 163, 184, 0.2)'
                    }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            border: '3px solid rgba(6, 182, 212, 0.3)',
                            borderTopColor: '#06b6d4',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        도로 스캔 데이터 로딩 중...
                    </div>
                </div>
            )}

            {/* Error Overlay */}
            {error && !loading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    color: 'white'
                }}>
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        textAlign: 'center',
                        maxWidth: '500px'
                    }}>
                        <div style={{
                            color: '#ef4444',
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '16px'
                        }}>
                            데이터 로딩 실패
                        </div>
                        <div style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '24px',
                            lineHeight: '1.6'
                        }}>
                            {error}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                ...createButtonStyle('primary'),
                                fontSize: '16px',
                                padding: '12px 24px'
                            }}
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            )}

            {/* CSS Animations */}
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    
                    .deck-tooltip {
                        background: rgba(15, 23, 42, 0.95) !important;
                        border: 1px solid rgba(148, 163, 184, 0.2) !important;
                        border-radius: 8px !important;
                        color: white !important;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                        font-size: 12px !important;
                        padding: 8px 12px !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
                    }
                `}
            </style>
        </div>
    );
}