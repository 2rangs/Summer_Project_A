"use client";
import React, { memo } from 'react';
import { Activity, BarChart3, Settings, Navigation, Maximize2, Minimize2, Zap } from 'lucide-react';
import { createGlassCard, createButtonStyle } from './styles';
import { ApiListResponse } from './types';

interface SystemStatusPanelProps {
    error: string | null;
    loading: boolean;
    resp: ApiListResponse | null;
    isMinimized: boolean;
    onToggleMinimize: () => void;
}

export const SystemStatusPanel = memo<SystemStatusPanelProps>(function SystemStatusPanel({
                                                                                             error,
                                                                                             loading,
                                                                                             resp,
                                                                                             isMinimized,
                                                                                             onToggleMinimize,
                                                                                         }) {
    const renderContent = () => {
        if (error) {
            return (
                <div style={{
                    background: "linear-gradient(135deg, rgba(239,68,68,.1) 0%, rgba(185,28,28,.05) 100%)",
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid rgba(239,68,68,.3)",
                    color: "#fca5a5",
                }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <Activity size={16} style={{ color: "#ef4444" }} />
                        <span style={{ fontWeight: 600 }}>Connection Error</span>
                    </div>
                    <div style={{ fontSize: 13 }}>{error}</div>
                </div>
            );
        }

        if (loading) {
            return (
                <div style={{
                    background: "linear-gradient(135deg, rgba(6,182,212,.1) 0%, rgba(8,145,178,.05) 100%)",
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid rgba(6,182,212,.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
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
                            데이터 수집 중
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>
                            실시간 도로 스캔 데이터를 불러오고 있습니다
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div style={{ color: "rgba(255,255,255,.9)" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: 16,
                    marginBottom: 20,
                }}>
                    <div style={{
                        background: "linear-gradient(135deg, rgba(16,185,129,.1) 0%, rgba(5,150,105,.05) 100%)",
                        padding: 16,
                        borderRadius: 12,
                        border: "1px solid rgba(16,185,129,.2)",
                    }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <Zap size={16} style={{ color: "#10b981" }} />
                            <span style={{ color: "#10b981", fontWeight: 600, fontSize: 13 }}>
                                시스템 상태
                            </span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <div style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "#10b981",
                                animation: "pulse 2s infinite",
                            }} />
                            <span style={{ color: "#10b981", fontSize: 12, fontWeight: 500 }}>
                                정상 작동
                            </span>
                        </div>
                    </div>

                    <div style={{
                        background: "linear-gradient(135deg, rgba(59,130,246,.1) 0%, rgba(37,99,235,.05) 100%)",
                        padding: 16,
                        borderRadius: 12,
                        border: "1px solid rgba(59,130,246,.2)",
                    }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <BarChart3 size={16} style={{ color: "#3b82f6" }} />
                            <span style={{ color: "#3b82f6", fontWeight: 600, fontSize: 13 }}>
                                데이터 통계
                            </span>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#3b82f6" }}>
                            {resp?.data?.total?.toLocaleString() || 0}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>
                            총 스캔 포인트
                        </div>
                    </div>
                </div>

                <div style={{
                    background: "rgba(0,0,0,.3)",
                    borderRadius: 12,
                    padding: 16,
                    border: "1px solid rgba(148,163,184,.1)",
                }}>
                    <div style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 12,
                        color: "#06b6d4",
                        fontWeight: 600,
                        fontSize: 13,
                    }}>
                        <Settings size={16} />
                        API 응답 정보
                    </div>
                    <div style={{
                        fontFamily: "ui-monospace, Menlo, monospace",
                        fontSize: 11,
                        background: "rgba(0,0,0,.4)",
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid rgba(148,163,184,.1)",
                        color: "rgba(255,255,255,.8)",
                    }}>
                        <div>상태 코드: <span style={{ color: "#10b981" }}>{resp?.code ?? "-"}</span></div>
                        <div>메시지: <span style={{ color: "#06b6d4" }}>{resp?.message ?? "-"}</span></div>
                        <div>수집 기간: 2025-07-20 ~ 2025-07-26</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            ...createGlassCard(),
            position: "absolute",
            zIndex: 10,
            top: 24,
            left: 24,
            width: isMinimized ? 320 : 420,
            maxHeight: isMinimized ? 80 : "70vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "all .4s cubic-bezier(.4,0,.2,1)",
        }}>
            <div style={{
                padding: "20px 24px",
                borderBottom: isMinimized ? "none" : "1px solid rgba(148,163,184,.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "linear-gradient(135deg,#06b6d4 0%,#0891b2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Navigation size={18} style={{ color: "white" }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>Road Monitor</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>
                            실시간 도로 모니터링 시스템
                        </div>
                    </div>
                </div>
                <button
                    onClick={onToggleMinimize}
                    style={{ ...createButtonStyle("secondary"), padding: 8, minWidth: 40 }}
                >
                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
            </div>
            {!isMinimized && (
                <div style={{ padding: "20px 24px", overflow: "auto" }}>
                    {renderContent()}
                </div>
            )}
        </div>
    );
});