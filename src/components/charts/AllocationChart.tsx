// =============================================================
//  src/components/charts/AllocationChart.tsx
//
//  WHAT CHANGED FROM WEEK 1:
//  - Accepts simplified ChartAsset type instead of full Asset
//  - Handles both MUTUAL_FUND (backend) and "Mutual Fund" (legacy)
// =============================================================

import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface ChartAsset {
    id: number;
    type: string;
    currentPrice: number;
}

interface AllocationChartProps {
    assets: ChartAsset[];
    symbol: string;
}

const TYPE_COLORS: Record<string, string> = {
    'MUTUAL_FUND': '#10b981',
    'ETF':         '#3b82f6',
    'STOCK':       '#f59e0b',
};

const TYPE_DISPLAY: Record<string, string> = {
    'MUTUAL_FUND': 'Mutual Fund',
    'ETF':         'ETF',
    'STOCK':       'Stock',
};

interface AllocPayload {
    active?: boolean;
    payload?: Array<{ name: string; payload: { color: string; percentage: string } }>;
}

function CustomTooltip({ active, payload }: AllocPayload) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
                <p className="text-xs font-semibold text-slate-700">{payload[0].name}</p>
                <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
                    {payload[0].payload.percentage}%
                </p>
            </div>
        );
    }
    return null;
}

export default function AllocationChart({ assets, symbol }: AllocationChartProps) {
    const allocationData = useMemo(() => {
        const grouped = assets.reduce<Record<string, number>>((acc, asset) => {
            acc[asset.type] = (acc[asset.type] ?? 0) + asset.currentPrice;
            return acc;
        }, {});

        const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);

        return Object.entries(grouped).map(([type, value]) => ({
            name: TYPE_DISPLAY[type] ?? type,
            value,
            percentage: total > 0 ? ((value / total) * 100).toFixed(1) : '0',
            color: TYPE_COLORS[type] ?? '#94a3b8',
        }));
    }, [assets]);

    const totalCurrentValue = useMemo(
        () => assets.reduce((sum, a) => sum + a.currentPrice, 0),
        [assets]
    );

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Asset Allocation
            </h2>
            <div className="flex items-center gap-6">
                <div className="h-36 w-36 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={allocationData} cx="50%" cy="50%"
                                innerRadius={40} outerRadius={68}
                                paddingAngle={3} dataKey="value">
                                {allocationData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    {allocationData.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: entry.color }} />
                                <span className="text-sm text-slate-600">{entry.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-semibold text-slate-800">
                                    {entry.percentage}%
                                </span>
                                <p className="text-xs text-slate-400">
                                    {symbol}{entry.value.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    ))}
                    {allocationData.length === 0 && (
                        <p className="text-sm text-slate-400 italic">No assets yet</p>
                    )}
                </div>
            </div>
            {totalCurrentValue > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
                    <span className="text-slate-500">Total current value</span>
                    <span className="font-bold text-slate-800">
                        {symbol}{totalCurrentValue.toLocaleString('en-IN')}
                    </span>
                </div>
            )}
        </div>
    );
}