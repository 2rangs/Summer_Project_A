// _components/DeviceStatusList.jsx
import React from 'react';
import { Clock, Navigation, Shield } from 'lucide-react';

const DeviceStatusList = ({ filteredData }) => (
    <div className="flex-1 bg-slate-800/50 rounded-xl border border-white/10 p-4">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            실시간 단말기 상태
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredData.slice(0, 8).map((item) => (
                <div key={item.id} className={`border rounded-lg p-3 text-xs ${
                    item.level === 'high' ? 'bg-red-500/10 border-red-500/30' :
                        item.level === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                            'bg-green-500/10 border-green-500/30'
                }`}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold flex items-center gap-2">
                            <Navigation className="w-3 h-3" />
                            {item.deviceId}
                        </span>
                        <span className="text-xs text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 mb-1">{item.description}</p>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{item.address}</span>
                        <span>{item.speed}km/h</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>위험도: {item.value}</span>
                        <span>신뢰도: {item.confidence}%</span>
                    </div>
                </div>
            ))}
            {filteredData.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                    <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">현재 활성 단말기가 없습니다</p>
                </div>
            )}
        </div>
    </div>
);

export default DeviceStatusList;