"use client";
import React, { memo, useState } from 'react';
import { X, Target, Calendar, MapPin, Cpu, Camera, Activity, Settings, Download } from 'lucide-react';
import { createGlassCard, createButtonStyle } from './styles';
import { ApiDetailResponse } from './types';
import { formatDateTime, getImageUrl } from './utils';

interface DetailPanelProps {
    detail: ApiDetailResponse | null;
    loading: boolean;
    error: string | null;
    onClose: () => void;
    currentZoom: number;
}

interface RowProps {
    labelIcon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}

const Row: React.FC<RowProps> = ({ labelIcon, label, children }) => (
    <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid rgba(255,255,255,.1)",
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {labelIcon}
            <span style={{ color: "rgba(255,255,255,.7)" }}>{label}</span>
        </div>
        <div>{children}</div>
    </div>
);

export const DetailPanel = memo<DetailPanelProps>(function DetailPanel({
                                                                           detail,
                                                                           loading,
                                                                           error,
                                                                           onClose,
                                                                           currentZoom,
                                                                       }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const d = detail?.data;

    if (!detail && !loading && !error) return null;

    return (
        <div style={{
            ...createGlassCard(),
            position: "absolute",
            zIndex: 10,
            top: "50%",
            right: 24,
            transform: "translateY(-50%)",
            width: 520,
            maxHeight: "85vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        }}>
            <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(148,163,184,.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(135deg, rgba(59,130,246,.1) 0%, rgba(37,99,235,.05) 100%)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "linear-gradient(135deg,#3b82f6 0%,#2563eb 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Target size={18} style={{ color: "white" }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>스캔 상세정보</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>
                            Detailed Scan • Zoom: {currentZoom.toFixed(1)}x
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{ ...createButtonStyle("danger"), padding: 8, minWidth: 40 }}
                >
                    <X size={16} />
                </button>
            </div>

            <div style={{ padding: 24, overflow: "auto" }}>
                {loading && (
                    <div style={{
                        background: "linear-gradient(135deg, rgba(6,182,212,.1) 0%, rgba(8,145,178,.05) 100%)",
                        padding: 16,
                        borderRadius: 12,
                        border: "1px solid rgba(6,182,212,.3)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 20,
                    }}>
                        <div style={{
                            width: 20,
                            height: 20,
                            border: "2px solid rgba(6,182,212,.3)",
                            borderTopColor: "#06b6d4",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                        }} />
                        <div>
                            <div style={{ color: "#06b6d4", fontWeight: 600, marginBottom: 4 }}>
                                상세 데이터 로드 중
                            </div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>
                                스캔 상세 정보를 불러오고 있습니다
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{
                        background: "linear-gradient(135deg, rgba(239,68,68,.1) 0%, rgba(185,28,28,.05) 100%)",
                        padding: 16,
                        borderRadius: 12,
                        border: "1px solid rgba(239,68,68,.3)",
                        color: "#fca5a5",
                        marginBottom: 20,
                    }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <Activity size={16} style={{ color: "#ef4444" }} />
                            <span style={{ fontWeight: 600 }}>데이터 로드 오류</span>
                        </div>
                        <div style={{ fontSize: 13 }}>{error}</div>
                    </div>
                )}

                {d && (
                    <>
                        <div style={{
                            background: "linear-gradient(135deg, rgba(16,185,129,.1) 0%, rgba(5,150,105,.05) 100%)",
                            borderRadius: 16,
                            padding: 20,
                            marginBottom: 20,
                            border: "1px solid rgba(16,185,129,.2)",
                        }}>
                            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                                <Activity size={18} style={{ color: "#10b981" }} />
                                <span style={{ color: "#10b981", fontWeight: 700, fontSize: 15 }}>
                                    스캔 데이터
                                </span>
                            </div>

                            <div style={{ display: "grid", gap: 12 }}>
                                <Row labelIcon={<Calendar size={14} />} label="촬영시간">
                                    <strong style={{ color: "#10b981" }}>
                                        {formatDateTime(String(d.capture_dt))}
                                    </strong>
                                </Row>
                                <Row labelIcon={<MapPin size={14} />} label="GPS 좌표">
                                    <span style={{
                                        fontFamily: "ui-monospace, monospace",
                                        fontSize: 12,
                                        background: "rgba(0,0,0,.3)",
                                        padding: "4px 8px",
                                        borderRadius: 6,
                                        color: "#06b6d4",
                                    }}>
                                        {(Number(d.link_lat ?? d.lat) || 0).toFixed(6)},{" "}
                                        {(Number(d.link_lot ?? d.lot) || 0).toFixed(6)}
                                    </span>
                                </Row>
                                <Row labelIcon={<Cpu size={14} />} label="디바이스 ID">
                                    <span style={{
                                        background: "linear-gradient(135deg, rgba(59,130,246,.2) 0%, rgba(37,99,235,.1) 100%)",
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "#3b82f6",
                                        border: "1px solid rgba(59,130,246,.3)",
                                    }}>
                                        {String(d.dvc_id ?? "Unknown")}
                                    </span>
                                </Row>
                            </div>
                        </div>

                        {d.road_img_file_nm && (
                            <div style={{
                                background: "linear-gradient(135deg, rgba(59,130,246,.1) 0%, rgba(37,99,235,.05) 100%)",
                                borderRadius: 16,
                                padding: 20,
                                marginBottom: 20,
                                border: "1px solid rgba(59,130,246,.2)",
                            }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 16,
                                }}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        color: "#3b82f6",
                                        fontWeight: 700,
                                        fontSize: 15,
                                    }}>
                                        <Camera size={18} />
                                        도로 영상 분석
                                    </div>
                                    <button
                                        onClick={() => window.open(getImageUrl(String(d.road_img_file_nm)), "_blank")}
                                        style={{
                                            ...createButtonStyle("secondary"),
                                            padding: "6px 12px",
                                            fontSize: 12,
                                        }}
                                    >
                                        <Download size={14} />
                                        원본보기
                                    </button>
                                </div>

                                <div style={{
                                    position: "relative",
                                    width: "100%",
                                    height: 320,
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    background: "rgba(0,0,0,.4)",
                                    border: "1px solid rgba(148,163,184,.1)",
                                }}>
                                    {!imageLoaded && (
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "rgba(0,0,0,.6)",
                                            zIndex: 1,
                                        }}>
                                            <div style={{
                                                width: 24,
                                                height: 24,
                                                border: "3px solid rgba(6,182,212,.3)",
                                                borderTopColor: "#06b6d4",
                                                borderRadius: "50%",
                                                animation: "spin 1s linear infinite",
                                            }} />
                                        </div>
                                    )}
                                    <img
                                        src={getImageUrl(String(d.road_img_file_nm))}
                                        alt="도로 스캔 이미지"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            transition: "opacity .3s ease",
                                        }}
                                        onLoad={() => setImageLoaded(true)}
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).style.display = "none";
                                            const parent = (e.currentTarget as HTMLImageElement).parentElement;
                                            if (parent) {
                                                parent.innerHTML = `
                                                    <div style="
                                                        display:flex;align-items:center;justify-content:center;
                                                        height:100%;flex-direction:column;gap:12px;
                                                        color:rgba(255,255,255,.7);background:rgba(0,0,0,.5)
                                                    ">
                                                        <div style="font-size:32px;opacity:.4">📷</div>
                                                        <div style="font-size:16px;">이미지를 불러올 수 없습니다</div>
                                                        <div style="font-size:14px;opacity:.7">네트워크 연결을 확인해주세요</div>
                                                    </div>`;
                                            }
                                        }}
                                    />
                                </div>

                                <div style={{
                                    marginTop: 12,
                                    padding: 12,
                                    background: "rgba(0,0,0,.3)",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    color: "rgba(255,255,255,.7)",
                                }}>
                                    <div style={{ marginBottom: 4 }}>
                                        <strong>파일명:</strong> {String(d.road_img_file_nm)}
                                    </div>
                                    <div>
                                        <strong>URL:</strong> {getImageUrl(String(d.road_img_file_nm))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{
                            background: "linear-gradient(135deg, rgba(71,85,105,.2) 0%, rgba(51,65,85,.1) 100%)",
                            borderRadius: 16,
                            padding: 20,
                            border: "1px solid rgba(148,163,184,.2)",
                        }}>
                            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                                <Settings size={18} style={{ color: "#94a3b8" }} />
                                <span style={{ color: "#94a3b8", fontWeight: 700, fontSize: 15 }}>
                                    Raw Data
                                </span>
                            </div>
                            <pre style={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-all",
                                fontSize: 11,
                                lineHeight: 1.5,
                                fontFamily: "ui-monospace, Menlo, monospace",
                                background: "rgba(0,0,0,.5)",
                                padding: 16,
                                borderRadius: 10,
                                border: "1px solid rgba(148,163,184,.1)",
                                color: "rgba(255,255,255,.85)",
                                maxHeight: 220,
                                overflow: "auto",
                            }}>
                                {JSON.stringify(detail, null, 2)}
                            </pre>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});