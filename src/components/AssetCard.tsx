// =============================================================
//  src/components/AssetCard.tsx

import { useCurrency } from '../context/CurrencyContext';
import type { AssetResponse } from '../api/assetApi';
import { ASSET_TYPE_DISPLAY } from '../api/assetApi';

interface AssetCardProps extends AssetResponse {
    onDelete: (id: number) => void;
}

export default function AssetCard({
    id, name, assetType, purchasePrice,
    currentPrice, isProfitable, gainLoss, onDelete
}: AssetCardProps) {
    const { symbol } = useCurrency();

    const gainLossPercent = purchasePrice > 0
        ? ((gainLoss / purchasePrice) * 100).toFixed(2)
        : '0.00';

    return (
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center mb-3 hover:shadow-md transition-all duration-200">

            <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-slate-800">{name}</h3>
                {/* ASSET_TYPE_DISPLAY maps MUTUAL_FUND → "Mutual Fund" */}
                <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full w-fit">
                    {ASSET_TYPE_DISPLAY[assetType]}
                </span>
            </div>

            <div className="text-right flex items-center gap-6">
                <div className="hidden sm:block">
                    <p className="text-xs text-slate-400 mb-0.5">Invested</p>
                    <p className="text-sm font-semibold text-slate-600">
                        {symbol}{purchasePrice.toLocaleString('en-IN')}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-400 mb-0.5">Current</p>
                    <p className={`text-base font-bold ${isProfitable ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {symbol}{currentPrice.toLocaleString('en-IN')}
                    </p>
                    <p className={`text-xs font-medium ${isProfitable ? 'text-emerald-500' : 'text-rose-400'}`}>
                        {isProfitable ? '+' : ''}{gainLossPercent}%
                    </p>
                </div>

                <button
                    onClick={() => onDelete(id)}
                    className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                    title="Remove asset"
                >✕</button>
            </div>
        </div>
    );
}