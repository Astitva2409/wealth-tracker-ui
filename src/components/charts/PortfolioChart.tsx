import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import type { PortfolioDataPoint } from '../../types';

interface PortfolioChartProps {
  data: PortfolioDataPoint[];
  symbol: string;
}

// ✅ Outside the component — but now accepts symbol as its own prop
interface TooltipPayload {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  symbol?: string;
}

function CustomTooltip({ active, payload, label, symbol }: TooltipPayload) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-base font-bold text-emerald-600">
          {symbol}{payload[0].value?.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
}

export default function PortfolioChart({ data, symbol }: PortfolioChartProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Portfolio Performance
      </h2>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v: number) => `${symbol}${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            {/* ✅ Pass symbol into the tooltip via the content prop */}
            <Tooltip content={<CustomTooltip symbol={symbol} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}