import React from 'react';

export const Legend = () => (
    <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded z-10">
        <div className="flex gap-2 items-center">
            <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
            낮음
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            보통
            <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
            높음
        </div>
    </div>
);

export const AttributionInfo = () => (
    <div className="absolute bottom-2 right-2 text-[10px] text-white/60 z-10">
        © Map tiles by Carto, Data © OpenStreetMap contributors
    </div>
);
