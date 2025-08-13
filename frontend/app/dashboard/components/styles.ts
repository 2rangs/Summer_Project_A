import React from 'react';

export const createGlassCard = (opacity = 0.95): React.CSSProperties => ({
    background: `linear-gradient(135deg, rgba(15, 23, 42, ${opacity}) 0%, rgba(30, 41, 59, ${opacity * 0.9}) 100%)`,
    backdropFilter: "blur(24px) saturate(200%)",
    border: "1px solid rgba(148,163,184,.2)",
    borderRadius: 20,
    boxShadow: "0 25px 50px -12px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.05),inset 0 1px 0 rgba(255,255,255,.1)",
    color: "white",
});

export type BtnVariant = "primary" | "secondary" | "danger" | "success";

export const createButtonStyle = (variant: BtnVariant = "secondary"): React.CSSProperties => {
    const variants: Record<BtnVariant, any> = {
        primary: {
            background: "linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)",
            border: "1px solid rgba(59,130,246,.5)",
            boxShadow: "0 4px 15px rgba(59,130,246,.4)",
        },
        secondary: {
            background: "linear-gradient(135deg,rgba(71,85,105,.8) 0%,rgba(51,65,85,.9) 100%)",
            border: "1px solid rgba(148,163,184,.3)",
            boxShadow: "0 2px 10px rgba(0,0,0,.3)",
        },
        danger: {
            background: "linear-gradient(135deg,#ef4444 0%,#dc2626 100%)",
            border: "1px solid rgba(239,68,68,.5)",
            boxShadow: "0 4px 15px rgba(239,68,68,.4)",
        },
        success: {
            background: "linear-gradient(135deg,#10b981 0%,#059669 100%)",
            border: "1px solid rgba(16,185,129,.5)",
            boxShadow: "0 4px 15px rgba(16,185,129,.4)",
        },
    };

    return {
        padding: "12px 20px",
        borderRadius: 14,
        cursor: "pointer",
        transition: "all .3s cubic-bezier(.4,0,.2,1)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 14,
        fontWeight: 600,
        userSelect: "none",
        color: "white",
        position: "relative",
        overflow: "hidden",
        ...variants[variant],
    };
};