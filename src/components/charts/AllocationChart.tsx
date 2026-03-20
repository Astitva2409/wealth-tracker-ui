// =============================================================
//  src/components/charts/AllocationChart.tsx
//
//  CONCEPT TAUGHT HERE: useMemo for derived/computed data
//
//  The allocation percentages are DERIVED from the assets array.
//  We wrap the calculation in useMemo so it only re-runs when
//  the assets array actually changes — not on every render.
// =============================================================

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import type { Asset } from '../../types';

interface AllocationChartProps {
  assets: Asset[];
  symbol: string;
}

interface AllocPayload {
  active?: boolean;
  payload?: Array<{
    name: string;
    payload: { color: string; percentage: string };
  }>;
}

// Color map for each asset type — defined outside the component
// so it's not recreated on every render (it's a constant)
const TYPE_COLORS: Record<string, string> = {
  'Mutual Fund': '#10b981', // emerald
  'ETF': '#3b82f6',         // blue
  'Stock': '#f59e0b',       // amber
};

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
  /*
    CONCEPT: useMemo
    - We group assets by type and compute totals
    - This runs ONLY when `assets` changes (the dependency array)
    - Without useMemo, this would re-run on EVERY render (expensive)
    
    Think of it like Java's lazy computation — calculate once, cache the result.
  */
  const allocationData = useMemo(() => {
    // Step 1: Group assets by type using .reduce()
    // reduce() is like a fold/accumulator — it builds up a result object
    const grouped = assets.reduce<Record<string, number>>((acc, asset) => {
      // If this type already exists in accumulator, add to it; else start at 0
      acc[asset.type] = (acc[asset.type] ?? 0) + asset.currentPrice;
      return acc;
    }, {});

    // Step 2: Calculate total for percentage math
    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);

    // Step 3: Convert grouped object into array format Recharts expects
    // Object.entries() gives us [[key, value], [key, value], ...]
    return Object.entries(grouped).map(([type, value]) => ({
      name: type,
      value,
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) : '0',
      color: TYPE_COLORS[type] ?? '#94a3b8',
    }));
  }, [assets]); // ← dependency: only re-compute if `assets` changes

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
        {/* Donut chart — innerRadius creates the "hole" in the middle */}
        <div className="h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={40}   // ← makes it a donut, not a full pie
                outerRadius={68}
                paddingAngle={3}   // small gap between slices
                dataKey="value"
              >
                {/* 
                  CONCEPT: .map() to render dynamic children
                  Each slice (Cell) gets its color from our TYPE_COLORS map.
                  This is the React way — data drives the rendering.
                */}
                {allocationData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend — built from the same allocationData array */}
        <div className="flex flex-col gap-2 flex-1">
          {allocationData.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
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

      {/* Total current value shown below chart */}
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