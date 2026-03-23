// =============================================================
//  src/components/AddAssetForm.tsx

import { useState, useRef } from 'react';
import type { AssetPayload, AssetType } from '../api/assetApi';

interface AddAssetFormProps {
    onAddAsset: (payload: AssetPayload) => void;
    isLoading: boolean;
}

export default function AddAssetForm({ onAddAsset, isLoading }: AddAssetFormProps) {
    const [name, setName] = useState('');
    const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
    const [currentPrice, setCurrentPrice] = useState<number | ''>('');
    const [assetType, setAssetType] = useState<AssetType>('MUTUAL_FUND');
    const [isOpen, setIsOpen] = useState(false);
    const [symbol, setSymbol] = useState('');
    const [units, setUnits] = useState<number | ''>('');

    const nameInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !purchasePrice || !currentPrice) return;

        onAddAsset({
            name,
            symbol: (assetType === 'STOCK' || assetType === 'ETF') ? symbol || undefined : undefined,
            assetType,
            purchasePrice: Number(purchasePrice),
            currentPrice: Number(currentPrice),
            units: units !== '' ? Number(units) : undefined
        });

        setName('');
        setPurchasePrice('');
        setCurrentPrice('');
        setAssetType('MUTUAL_FUND');
        setSymbol('');
        setIsOpen(false);
        setTimeout(() => nameInputRef.current?.focus(), 50);
        setUnits('');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full border-2 border-dashed border-slate-300 hover:border-emerald-400 text-slate-400 hover:text-emerald-600 p-4 rounded-xl transition-colors font-medium mb-6"
            >
                + Log New Investment
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-slate-700">Log New Investment</h2>
                <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="Asset name (e.g. HDFC Midcap)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    required
                />
                <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value as AssetType)}
                    className="border border-slate-200 bg-slate-50 p-3 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                >
                    {/* Values match backend enum names */}
                    <option value="MUTUAL_FUND">Mutual Fund</option>
                    <option value="ETF">ETF</option>
                    <option value="STOCK">Stock</option>
                </select>

                {(assetType === 'STOCK' || assetType === 'ETF') && (
                    <input
                        type="text"
                        placeholder="BSE Symbol (e.g. IVZINGOLD, HDFCBANK)"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        className="w-full border rounded px-3 py-2 text-sm"
                    />
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Amount Invested</label>
                        <input
                            type="number"
                            placeholder="e.g. 25000"
                            value={purchasePrice}
                            onChange={(e) => setPurchasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                            className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Current Value</label>
                        <input
                            type="number"
                            placeholder="e.g. 28000"
                            value={currentPrice}
                            onChange={(e) => setCurrentPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                        Units Purchased
                    </label>
                    <input
                        type="number"
                        placeholder="e.g. 20.5 units"
                        value={units}
                        onChange={(e) => setUnits(e.target.value === '' ? '' : Number(e.target.value))}
                        className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                </div>

                {/* Live gain/loss preview */}
                {purchasePrice !== '' && currentPrice !== '' && (
                    <div className={`text-xs font-medium px-3 py-2 rounded-lg ${Number(currentPrice) >= Number(purchasePrice)
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                        }`}>
                        {Number(currentPrice) >= Number(purchasePrice)
                            ? `▲ Gain: ₹${(Number(currentPrice) - Number(purchasePrice)).toLocaleString('en-IN')}`
                            : `▼ Loss: ₹${(Number(purchasePrice) - Number(currentPrice)).toLocaleString('en-IN')}`
                        }
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
            >
                {isLoading ? 'Adding...' : 'Add to Portfolio'}
            </button>
        </form>
    );
}