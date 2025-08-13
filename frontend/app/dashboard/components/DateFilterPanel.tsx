"use client";
import React, { memo, useMemo } from 'react';
import { Calendar, CalendarDays, Database, Maximize2, Minimize2 } from 'lucide-react';
import { createGlassCard, createButtonStyle } from './styles';
import { DateGroup } from './types';

interface DateFilterPanelProps {
    dateGroups: DateGroup[];
    selectedDate: string;
    onDateSelect: (date: string) => void;
    isMinimized: boolean;
    onToggleMinimize: () => void;
}

export const DateFilterPanel = memo<DateFilterPanelProps>(function DateFilterPanel({
                                                                                       dateGroups,
                                                                                       selectedDate,
                                                                                       onDateSelect,
                                                                                       isMinimized,
                                                                                       onToggleMinimize,
                                                                                   }) {
    const total = useMemo(
        () => dateGroups.reduce((sum, g) => sum + g.items.length, 0),
        [dateGroups]
    );

    return (
        <div style={{
            ...createGlassCard(),
            position: "absolute",
            zIndex: 10,
            top: 24,
            right: 24,
            width: isMinimized ? 280 : 360,
            maxHeight: isMinimized ? 80 : "60vh",
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
                        background: "linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <CalendarDays size={18} style={{ color: "white" }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>날짜 필터</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>
                            Date Filter & Analytics
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
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <button
                            onClick={() => onDateSelect("all")}
                            style={{
                                ...createButtonStyle(selectedDate === "all" ? "primary" : "secondary"),
                                padding: "16px 20px",
                                justifyContent: "space-between",
                                borderRadius: 12,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Database size={16} />
                                <span>전체 데이터</span>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>
                                {total}
                            </div>
                        </button>

                        {dateGroups.map((g) => (
                            <button
                                key={g.date}
                                onClick={() => onDateSelect(g.date)}
                                style={{
                                    ...createButtonStyle(selectedDate === g.date ? "primary" : "secondary"),
                                    padding: "16px 20px",
                                    justifyContent: "space-between",
                                    borderRadius: 12,
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Calendar size={16} />
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                                            {g.displayDate}
                                        </div>
                                        <div style={{ fontSize: 12, opacity: 0.8 }}>{g.date}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>
                                    {g.items.length}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});
