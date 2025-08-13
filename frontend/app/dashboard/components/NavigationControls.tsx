"use client";
import React, { memo, useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Clock, Filter, Volume2, VolumeX } from 'lucide-react';
import { createGlassCard, createButtonStyle } from './styles';

interface NavigationControlsProps {
    currentIndex: number;
    totalItems: number;
    isPlaying: boolean;
    playbackSpeed: number;
    onPrevious: () => void;
    onNext: () => void;
    onPlayPause: () => void;
    onSpeedChange: (speed: number) => void;
    selectedDate: string;
}

export const NavigationControls = memo<NavigationControlsProps>(function NavigationControls({
                                                                                                currentIndex,
                                                                                                totalItems,
                                                                                                isPlaying,
                                                                                                playbackSpeed,
                                                                                                onPrevious,
                                                                                                onNext,
                                                                                                onPlayPause,
                                                                                                onSpeedChange,
                                                                                                selectedDate,
                                                                                            }) {
    const [soundEnabled, setSoundEnabled] = useState(false);

    return (
        <div style={{
            ...createGlassCard(),
            position: "absolute",
            zIndex: 10,
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            gap: 24,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                    onClick={onPrevious}
                    disabled={totalItems === 0}
                    style={{ ...createButtonStyle("secondary"), padding: 14, minWidth: 44 }}
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={onPlayPause}
                    disabled={totalItems === 0}
                    style={{
                        ...createButtonStyle(isPlaying ? "danger" : "success"),
                        padding: "16px 28px",
                        fontSize: 15,
                    }}
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    <span>{isPlaying ? "정지" : "재생"}</span>
                </button>
                <button
                    onClick={onNext}
                    disabled={totalItems === 0}
                    style={{ ...createButtonStyle("secondary"), padding: 14, minWidth: 44 }}
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            <div style={{ height: 40, width: 1, background: "rgba(148,163,184,.3)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Clock size={16} style={{ color: "#06b6d4" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, minWidth: 80 }}>
                        {totalItems === 0 ? "0 / 0" : `${currentIndex + 1} / ${totalItems}`}
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Filter size={16} style={{ color: "#8b5cf6" }} />
                    <span style={{ fontSize: 13, opacity: 0.7 }}>
                        {selectedDate === "all" ? "전체" : selectedDate}
                    </span>
                </div>

                <select
                    value={playbackSpeed}
                    onChange={(e) => onSpeedChange(Number(e.target.value))}
                    style={{
                        background: "linear-gradient(135deg,rgba(71,85,105,.8) 0%,rgba(51,65,85,.9) 100%)",
                        border: "1px solid rgba(148,163,184,.3)",
                        borderRadius: 10,
                        color: "white",
                        padding: "8px 12px",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                    }}
                >
                    <option value={0.5}>0.5x 느리게</option>
                    <option value={1}>1x 보통</option>
                    <option value={2}>2x 빠르게</option>
                    <option value={4}>4x 매우빠르게</option>
                </select>

                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    style={{ ...createButtonStyle("secondary"), padding: 10, minWidth: 40 }}
                >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
            </div>
        </div>
    );
});