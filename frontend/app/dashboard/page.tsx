'use client';

import React from 'react';
import { AlertTriangle, Navigation, Zap, Activity } from 'lucide-react';

import Header from './_components/Header';
import StatCard from './_components/StatCard';
import ControlPanel from './_components/ControlPanel';
import DeviceStatusList from './_components/DeviceStatusList';
import MapVisualization from './_components/MapVisualization';
import {
    HazardTypeChart,
    SourceAnalysisChart,
    RadarAnalysisChart,
    TimeSeriesChart
} from './_components/ChartComponents';

import {
    useDashboardState,
    useFilteredData,
    useStats,
    useChartData
} from './_components/hooks';

export default function RoadHazardMonitoringDashboard() {
    const {
        currentTime,
        mockHazmatData,
        selectedHazardType,
        setSelectedHazardType,
        selectedSeverity,
        setSelectedSeverity,
        isRealTime,
        setIsRealTime,
        showMovement,
        setShowMovement,
        showTrails,
        setShowTrails,
        animationTime,
        refreshData
    } = useDashboardState();

    const filteredData = useFilteredData(mockHazmatData, selectedHazardType, selectedSeverity);
    const stats = useStats(filteredData);
    const chartData = useChartData(filteredData, mockHazmatData);

    return (
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* 헤더 */}
            <Header onRefresh={refreshData} highAlertCount={stats.high} />

            {/* 메인 레이아웃 */}
            <div className=" grid grid-cols-[20rem_1fr_20rem] gap-0">
                {/* 좌측 사이드바 */}
                <aside className="bg-slate-800/40 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col gap-4 overflow-y-auto">
                    <ControlPanel
                        selectedHazardType={selectedHazardType}
                        setSelectedHazardType={setSelectedHazardType}
                        selectedSeverity={selectedSeverity}
                        setSelectedSeverity={setSelectedSeverity}
                        isRealTime={isRealTime}
                        setIsRealTime={setIsRealTime}
                        showMovement={showMovement}
                        setShowMovement={setShowMovement}
                        showTrails={showTrails}
                        setShowTrails={setShowTrails}
                    />

                    {/* 주요 통계 */}
                    <div className="space-y-3">
                        <StatCard
                            title="활성 단말기"
                            value={stats.active}
                            icon={Navigation}
                            colorClass="bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-blue-500/30"
                            trend="+2.3%"
                        />
                        <StatCard
                            title="고위험 구간"
                            value={stats.high}
                            icon={AlertTriangle}
                            colorClass="bg-gradient-to-r from-red-600/20 to-red-500/10 border-red-500/30"
                            trend="-5.1%"
                            isAlert={stats.high > 5}
                        />
                        <StatCard
                            title="평균 위험도"
                            value={stats.avgValue}
                            icon={Zap}
                            colorClass="bg-gradient-to-r from-yellow-600/20 to-yellow-500/10 border-yellow-500/30"
                            trend="+1.8%"
                        />
                        <StatCard
                            title="평균 속도"
                            value={`${stats.avgSpeed}km/h`}
                            icon={Activity}
                            colorClass="bg-gradient-to-r from-green-600/20 to-green-500/10 border-green-500/30"
                            trend="+3.2%"
                        />
                    </div>

                    <DeviceStatusList filteredData={filteredData} />
                </aside>

                {/* 지도 및 차트 */}
                <main className="">
                    <div className="flex-1 overflow-hidden">
                        <MapVisualization
                            data={filteredData}
                            showMovement={showMovement}
                            showTrails={showTrails}
                            animationTime={animationTime}
                            filteredCount={filteredData.length}
                        />
                    </div>
                    <div className="bg-slate-800/40 backdrop-blur-xl border-t  p-4 mt-8 border-white/10">
                        <TimeSeriesChart data={chartData.timeSeries} />
                    </div>
                </main>

                {/* 우측 차트 패널 */}
                <aside className="p-4 flex flex-col gap-3 overflow-y-auto border-l border-white/10 bg-slate-800/30">
                    <div className="h-60">
                        <HazardTypeChart data={chartData.pieData} />
                    </div>
                    <div className="h-60">
                        <SourceAnalysisChart data={chartData.sourceData} />
                    </div>
                    <div className="h-48">
                        <RadarAnalysisChart data={chartData.radarData} />
                    </div>
                </aside>
            </div>
        </div>
    );
}