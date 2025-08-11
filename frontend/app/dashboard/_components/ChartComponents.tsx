// _components/ChartComponents.jsx
import React from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { Flame, MapPin, Activity, TrendingUp } from 'lucide-react';

export const HazardTypeChart = ({ data }) => (
    <div className="h-80 bg-slate-800/40 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4" />
            도로 위험물 유형 분포
        </h3>
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={60}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

export const SourceAnalysisChart = ({ data }) => (
    <div className="h-80 bg-slate-800/40 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            감지 장비별 분석
        </h3>
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                    }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export const RadarAnalysisChart = ({ data }) => (
    <div className="flex-1 bg-slate-800/40 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            위험물별 위험도 분석
        </h3>
        <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={data}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="type" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 8, fill: '#6b7280' }}
                />
                <Radar
                    name="평균 위험도"
                    dataKey="avgSeverity"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                    }}
                />
            </RadarChart>
        </ResponsiveContainer>
    </div>
);

export const TimeSeriesChart = ({ data }) => (
    <footer className=" bottom-4 left-4 right-4 h-32 bg-slate-800/40 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            시간별 위험도 추이 및 심각도 분포
        </h3>
        <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={8} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                    }}
                />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
            </AreaChart>
        </ResponsiveContainer>
    </footer>
);