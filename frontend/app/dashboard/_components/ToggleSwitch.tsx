// _components/ToggleSwitch.jsx
import React from 'react';

const ToggleSwitch = ({ label, isOn, onToggle, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        purple: 'bg-purple-600'
    };

    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">{label}</span>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isOn ? colorClasses[color] : 'bg-slate-600'
                }`}
            >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    isOn ? 'translate-x-5' : 'translate-x-1'
                }`} />
            </button>
        </div>
    );
};

export default ToggleSwitch;