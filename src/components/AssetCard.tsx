// =============================================================
//  src/components/AssetCard.tsx
//
//  CHANGE FROM BEFORE:
//  We no longer export the Asset interface from here.
//  It now lives in src/types/index.ts — the single source of truth.
//  This component is purely responsible for DISPLAY, not data contracts.
// =============================================================

import { useCurrency } from '../context/CurrencyContext';
import type { Asset } from '../types';

// We EXTEND the Asset type to add the onDelete callback.
// Think of "extends" here like Java's interface inheritance.
interface AssetCardProps extends Asset {
  onDelete: (id: number) => void;
}

export default function AssetCard({ id, name, type, amount, purchasePrice, currentPrice, isProfitable, onDelete }: AssetCardProps) {
  const { symbol } = useCurrency();

  // CONCEPT: Derived state — we calculate gain/loss right inside the component.
  // We do NOT store this in useState because it's always calculable from props.
  // Rule: if you can calculate it from existing data, don't put it in state.
  const gainLoss = currentPrice - purchasePrice;
  const gainLossPercent = purchasePrice > 0
    ? ((gainLoss / purchasePrice) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center mb-3 hover:shadow-md transition-all duration-200">

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-slate-800">{name}</h3>
        <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full w-fit">
          {type}
        </span>
      </div>

      <div className="text-right flex items-center gap-6">
        {/* Invested amount */}
        <div className="hidden sm:block">
          <p className="text-xs text-slate-400 mb-0.5">Invested</p>
          <p className="text-sm font-semibold text-slate-600">
            {symbol}{amount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Current value + gain/loss */}
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Current</p>
          <p className={`text-base font-bold ${isProfitable ? 'text-emerald-600' : 'text-rose-500'}`}>
            {symbol}{currentPrice.toLocaleString('en-IN')}
          </p>
          {/* 
            CONCEPT: Conditional rendering with ternary.
            isProfitable ? "+" : "-" decides the sign character.
            Template literal builds the full string.
          */}
          <p className={`text-xs font-medium ${isProfitable ? 'text-emerald-500' : 'text-rose-400'}`}>
            {isProfitable ? '+' : ''}{gainLossPercent}%
          </p>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(id)}
          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
          title="Remove asset"
        >
          {/* Using a unicode × character as a lightweight icon */}
          ✕
        </button>
      </div>
    </div>
  );
}