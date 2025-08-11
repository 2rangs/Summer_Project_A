"use client"

import React, { useEffect, useState } from 'react';
import { Shield, RefreshCw, Download, Bell } from 'lucide-react';

const Header = ({ onRefresh, highAlertCount }) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return (
        <header className="h-16 bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-600/20 rounded-xl">
                        <Shield className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            도로 위험물 모니터링 센터
                        </h1>
                        <p className="text-xs text-slate-400">
                            실시간 도로 균열·포트홀 감지 및 이동 단말기 추적 시스템
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onRefresh}
                    className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                    title="데이터 새로고침"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
                <button
                    className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                    title="데이터 다운로드"
                >
                    <Download className="w-4 h-4" />
                </button>
                <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors relative">
                    <Bell className="w-4 h-4" />
                    {hasMounted && highAlertCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {highAlertCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
