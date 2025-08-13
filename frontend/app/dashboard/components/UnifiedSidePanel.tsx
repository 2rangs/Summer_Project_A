"use client";
import React, { memo, useState } from 'react';
import {
    X, MapPin, Calendar, Camera, ExternalLink, ChevronUp, ChevronDown,
    Play, Pause, ChevronLeft, ChevronRight, Clock, Zap
} from 'lucide-react';
import { ApiDetailResponse } from './types';
import { formatDateTime, getImageUrl } from './utils';

interface UnifiedSidePanelProps {
    // Detail Panel Props
    detail: ApiDetailResponse | null;
    loading: boolean;
    error: string | null;
    onClose: () => void;
    currentZoom: number;

    // Control Bar Props
    currentIndex: number;
    totalItems: number;
    isPlaying: boolean;
    playbackSpeed: number;
    onPrevious: () => void;
    onNext: () => void;
    onPlayPause: () => void;
    onSpeedChange: (speed: number) => void;
    selectedDate: string;
    showDetail: boolean;
}

export const UnifiedSidePanel = memo<UnifiedSidePanelProps>(function UnifiedSidePanel({
                                                                                          detail,
                                                                                          loading,
                                                                                          error,
                                                                                          onClose,
                                                                                          currentZoom,
                                                                                          currentIndex,
                                                                                          totalItems,
                                                                                          isPlaying,
                                                                                          playbackSpeed,
                                                                                          onPrevious,
                                                                                          onNext,
                                                                                          onPlayPause,
                                                                                          onSpeedChange,
                                                                                          selectedDate,
                                                                                          showDetail,
                                                                                      }) {
    const [imageExpanded, setImageExpanded] = useState(false);
    const [historyExpanded, setHistoryExpanded] = useState(false);
    const d = detail?.data;

    return (
        <div style={{
            width: showDetail ? 400 : 320,
            background: "white",
            borderLeft: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "width 0.3s ease",
        }}>
            {/* Control Section (Always Visible) */}
            <div style={{
                padding: "20px",
                borderBottom: "1px solid #e2e8f0",
                background: "#f8fafc",
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                }}>
                    <div>
                        <h3 style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#1e293b",
                            margin: 0,
                            marginBottom: 4,
                        }}>
                            {showDetail ? "스캔 상세정보" : "재생 컨트롤"}
                        </h3>
                        <p style={{
                            fontSize: 13,
                            color: "#64748b",
                            margin: 0,
                        }}>
                            {showDetail ? `Zoom: ${currentZoom.toFixed(1)}x` : `${totalItems.toLocaleString()}개 데이터`}
                        </p>
                    </div>
                    {showDetail && (
                        <button
                            onClick={onClose}
                            style={{
                                padding: 6,
                                borderRadius: 6,
                                border: "1px solid #e2e8f0",
                                background: "white",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <X size={14} style={{ color: "#64748b" }} />
                        </button>
                    )}
                </div>

                {/* Playback Controls */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}>
                    {/* Main Controls */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}>
                        <button
                            onClick={onPrevious}
                            disabled={totalItems === 0}
                            style={{
                                padding: 10,
                                borderRadius: 8,
                                border: "1px solid #e2e8f0",
                                background: totalItems === 0 ? "#f8fafc" : "white",
                                cursor: totalItems === 0 ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: totalItems === 0 ? 0.5 : 1,
                            }}
                        >
                            <ChevronLeft size={16} style={{ color: "#64748b" }} />
                        </button>

                        <button
                            onClick={onPlayPause}
                            disabled={totalItems === 0}
                            style={{
                                padding: "12px 20px",
                                borderRadius: 8,
                                border: "none",
                                background: totalItems === 0 ? "#f1f5f9" : isPlaying ? "#ef4444" : "#22c55e",
                                cursor: totalItems === 0 ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "white",
                                opacity: totalItems === 0 ? 0.5 : 1,
                                minWidth: 90,
                                justifyContent: "center",
                            }}
                        >
                            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                            <span>{isPlaying ? "정지" : "재생"}</span>
                        </button>

                        <button
                            onClick={onNext}
                            disabled={totalItems === 0}
                            style={{
                                padding: 10,
                                borderRadius: 8,
                                border: "1px solid #e2e8f0",
                                background: totalItems === 0 ? "#f8fafc" : "white",
                                cursor: totalItems === 0 ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: totalItems === 0 ? 0.5 : 1,
                            }}
                        >
                            <ChevronRight size={16} style={{ color: "#64748b" }} />
                        </button>
                    </div>

                    {/* Progress Info */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            color: "#64748b",
                        }}>
                            <Clock size={14} />
                            <span style={{ fontWeight: 500 }}>
                                {totalItems === 0 ? "0 / 0" : `${currentIndex + 1} / ${totalItems}`}
                            </span>
                        </div>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                            color: "#64748b",
                        }}>
                            <span>속도:</span>
                            <select
                                value={playbackSpeed}
                                onChange={(e) => onSpeedChange(Number(e.target.value))}
                                style={{
                                    padding: "2px 6px",
                                    fontSize: 12,
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 4,
                                    background: "white",
                                    cursor: "pointer",
                                }}
                            >
                                <option value={0.5}>0.5x</option>
                                <option value={1}>1x</option>
                                <option value={2}>2x</option>
                                <option value={4}>4x</option>
                            </select>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {totalItems > 0 && (
                        <div style={{
                            width: "100%",
                            height: 4,
                            background: "#e2e8f0",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}>
                            <div style={{
                                width: `${((currentIndex + 1) / totalItems) * 100}%`,
                                height: "100%",
                                background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
                                borderRadius: 2,
                                transition: "width 0.3s ease",
                            }} />
                        </div>
                    )}

                    {/* Filter Info */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: "white",
                        borderRadius: 6,
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                        color: "#475569",
                    }}>
                        <Zap size={12} />
                        <span style={{ fontWeight: 500 }}>
                            {selectedDate === "all" ? "전체 기간" : selectedDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* Detail Section (Conditional) */}
            {showDetail && (
                <div style={{
                    flex: 1,
                    overflow: "auto",
                    padding: "20px",
                }}>
                    {loading && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "16px",
                            background: "#f0f9ff",
                            borderRadius: 8,
                            border: "1px solid #e0f2fe",
                            marginBottom: 20,
                        }}>
                            <div style={{
                                width: 16,
                                height: 16,
                                border: "2px solid #e0f2fe",
                                borderTopColor: "#0ea5e9",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                            }} />
                            <span style={{ color: "#0369a1", fontSize: 13, fontWeight: 500 }}>
                                상세 데이터 로드 중...
                            </span>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            padding: "12px",
                            background: "#fef2f2",
                            borderRadius: 8,
                            border: "1px solid #fecaca",
                            marginBottom: 20,
                        }}>
                            <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 500, margin: 0 }}>
                                데이터 로드 오류: {error}
                            </p>
                        </div>
                    )}

                    {d && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {/* Basic Info */}
                            <div style={{
                                background: "#f8fafc",
                                padding: "12px",
                                borderRadius: 8,
                                border: "1px solid #e2e8f0",
                            }}>
                                <h4 style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#374151",
                                    margin: "0 0 10px 0",
                                }}>
                                    스캔 정보
                                </h4>

                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <InfoRow
                                        icon={<Calendar size={12} style={{ color: "#64748b" }} />}
                                        label="촬영시간"
                                        value={formatDateTime(String(d.capture_dt))}
                                    />
                                    <InfoRow
                                        icon={<MapPin size={12} style={{ color: "#64748b" }} />}
                                        label="GPS 좌표"
                                        value={`${(Number(d.link_lat ?? d.lat) || 0).toFixed(4)}, ${(Number(d.link_lot ?? d.lot) || 0).toFixed(4)}`}
                                    />
                                </div>
                            </div>

                            {/* Road Image */}
                            {d.road_img_file_nm && (
                                <div style={{
                                    background: "white",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 8,
                                    overflow: "hidden",
                                }}>
                                    <div style={{
                                        padding: "10px 12px",
                                        background: "#f8fafc",
                                        borderBottom: "1px solid #e2e8f0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                        }}>
                                            <Camera size={14} style={{ color: "#64748b" }} />
                                            <span style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: "#374151",
                                            }}>
                                                도로 영상
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button
                                                onClick={() => setImageExpanded(!imageExpanded)}
                                                style={{
                                                    padding: "3px 6px",
                                                    fontSize: 11,
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: 4,
                                                    background: "white",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 3,
                                                }}
                                            >
                                                {imageExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                                                {imageExpanded ? "접기" : "펼치기"}
                                            </button>
                                            <button
                                                onClick={() => window.open(getImageUrl(String(d.road_img_file_nm)), "_blank")}
                                                style={{
                                                    padding: "3px 6px",
                                                    fontSize: 11,
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: 4,
                                                    background: "white",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 3,
                                                }}
                                            >
                                                <ExternalLink size={10} />
                                                원본
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{
                                        height: imageExpanded ? "auto" : 160,
                                        overflow: "hidden",
                                        position: "relative",
                                    }}>
                                        <img
                                            src={getImageUrl(String(d.road_img_file_nm))}
                                            alt="도로 스캔 이미지"
                                            style={{
                                                width: "100%",
                                                height: imageExpanded ? "auto" : "100%",
                                                objectFit: imageExpanded ? "contain" : "cover",
                                                display: "block",
                                            }}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                                const parent = (e.currentTarget as HTMLImageElement).parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `
                                                        <div style="
                                                            display:flex;align-items:center;justify-content:center;
                                                            height:160px;flex-direction:column;gap:8px;
                                                            color:#64748b;background:#f8fafc
                                                        ">
                                                            <div style="font-size:20px;">📷</div>
                                                            <div style="font-size:12px;">이미지 로드 실패</div>
                                                        </div>`;
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Road History */}
                            <div style={{
                                background: "white",
                                border: "1px solid #e2e8f0",
                                borderRadius: 8,
                            }}>
                                <button
                                    onClick={() => setHistoryExpanded(!historyExpanded)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        background: "#f8fafc",
                                        border: "none",
                                        borderBottom: historyExpanded ? "1px solid #e2e8f0" : "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "#374151",
                                    }}
                                >
                                    <span>Road History</span>
                                    {historyExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>

                                {historyExpanded && (
                                    <div style={{ padding: "12px" }}>
                                        <div style={{
                                            display: "flex",
                                            gap: 8,
                                            marginBottom: 8,
                                        }}>
                                            <img
                                                src={getImageUrl(String(d.road_img_file_nm))}
                                                alt="Road history"
                                                style={{
                                                    width: 60,
                                                    height: 45,
                                                    borderRadius: 4,
                                                    objectFit: "cover",
                                                    border: "1px solid #e2e8f0",
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <p style={{
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    color: "#374151",
                                                    margin: "0 0 3px 0",
                                                }}>
                                                    2025-07-23 09:55:55
                                                </p>
                                                <p style={{
                                                    fontSize: 11,
                                                    color: "#64748b",
                                                    margin: 0,
                                                }}>
                                                    이전 스캔 기록
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#64748b",
            }}>
                {icon}
                <span>{label}</span>
            </div>
            <span style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#374151",
                textAlign: "right",
                maxWidth: "60%",
                wordBreak: "break-all",
            }}>
                {value}
            </span>
        </div>
    );
}