"use client"
// _components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass, trend, isAlert = false }) => (
    <div className={`p-3 rounded-xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${colorClass} ${isAlert ? 'animate-pulse' : ''}`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-1 bg-white/10 rounded-lg">
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs text-slate-300 mb-1">{title}</p>
                    <p className="text-lg font-bold">{value}</p>
                </div>
            </div>
            {trend && (
                <div className={`text-xs font-semibold px-1 py-0.5 rounded-full ${
                    trend.startsWith('+') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                    {trend}
                </div>
            )}
        </div>
    </div>
);

export default StatCard;