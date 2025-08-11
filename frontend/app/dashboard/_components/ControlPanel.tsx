// _components/ControlPanel.jsx
import React from 'react';
import { Settings } from 'lucide-react';
import { HAZARD_TYPES, SEVERITY_LEVELS } from './constants';
import ToggleSwitch from './ToggleSwitch';

const ControlPanel = ({
                          selectedHazardType,
                          setSelectedHazardType,
                          selectedSeverity,
                          setSelectedSeverity,
                          isRealTime,
                          setIsRealTime,
                          showMovement,
                          setShowMovement,
                          showTrails,
                          setShowTrails
                      }) => (
    <div className="bg-slate-800/50 rounded-xl border border-white/10 p-4">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            제어 패널
        </h3>

        <div className="space-y-3">
            <div>
                <label className="text-xs text-slate-300 mb-1 block">위험물 유형</label>
                <select
                    value={selectedHazardType}
                    onChange={(e) => setSelectedHazardType(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-2 py-1 text-xs"
                >
                    <option value="all">전체</option>
                    {Object.keys(HAZARD_TYPES).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-xs text-slate-300 mb-1 block">위험도 수준</label>
                <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-2 py-1 text-xs"
                >
                    <option value="all">전체</option>
                    {Object.entries(SEVERITY_LEVELS).map(([key, level]) => (
                        <option key={key} value={key}>{level.label}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <ToggleSwitch
                    label="실시간 업데이트"
                    isOn={isRealTime}
                    onToggle={() => setIsRealTime(!isRealTime)}
                    color="blue"
                />
                <ToggleSwitch
                    label="단말기 이동"
                    isOn={showMovement}
                    onToggle={() => setShowMovement(!showMovement)}
                    color="green"
                />
                <ToggleSwitch
                    label="이동 궤적"
                    isOn={showTrails}
                    onToggle={() => setShowTrails(!showTrails)}
                    color="purple"
                />
            </div>
        </div>
    </div>
);

export default ControlPanel;