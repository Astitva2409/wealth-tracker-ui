// =============================================================
//  src/components/AddAssetForm.tsx
//
//  FIXES FROM BEFORE:
//  1. isProfitable was hardcoded to `true` — now computed from inputs
//  2. Asset type now imported from src/types, not from AssetCard
//  3. Added purchasePrice and currentPrice fields (matches new Asset shape)
// =============================================================

import { useState, useRef } from 'react';
import type { NewAssetPayload } from '../types';

interface AddAssetFormProps {
  onAddAsset: (asset: NewAssetPayload) => void;
}

export default function AddAssetForm({ onAddAsset }: AddAssetFormProps) {
  const [name, setName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [currentPrice, setCurrentPrice] = useState<number | ''>('');
  const [type, setType] = useState<'Mutual Fund' | 'ETF' | 'Stock'>('Mutual Fund');
  const [isOpen, setIsOpen] = useState(false); // CONCEPT: UI toggle state

  // useRef lets us imperatively focus the input after form submission
  // without causing a re-render (unlike state)
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    // Prevent browser's default form submit (which would reload the page)
    e.preventDefault();
    if (!name || !purchasePrice || !currentPrice) return;

    const purchase = Number(purchasePrice);
    const current = Number(currentPrice);

    // FIX: isProfitable is now COMPUTED, not hardcoded
    // This is "derived data" — calculated from other values, not stored separately
    const newAsset: NewAssetPayload = {
      name,
      type,
      amount: purchase,         // amount invested = what you paid
      purchasePrice: purchase,
      currentPrice: current,
      isProfitable: current >= purchase,  // ← THE FIX
    };

    onAddAsset(newAsset);

    // Reset form
    setName('');
    setPurchasePrice('');
    setCurrentPrice('');
    setType('Mutual Fund');
    setIsOpen(false);

    // Bring focus back to name input for next entry
    nameInputRef.current?.focus();
  };

  return (
    <div className="mb-6">
      {/* 
        CONCEPT: Conditional rendering with &&
        isOpen && <JSX> means: "only render the JSX if isOpen is true"
        This is the React pattern for show/hide — we don't use display:none
      */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full border-2 border-dashed border-slate-300 hover:border-emerald-400 text-slate-400 hover:text-emerald-600 p-4 rounded-xl transition-colors font-medium"
        >
          + Log New Investment
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-200"
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-slate-700">Log New Investment</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >✕</button>
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
              value={type}
              onChange={(e) => setType(e.target.value as 'Mutual Fund' | 'ETF' | 'Stock')}
              className="border border-slate-200 bg-slate-50 p-3 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              <option value="Mutual Fund">Mutual Fund</option>
              <option value="ETF">ETF</option>
              <option value="Stock">Stock</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Amount Invested (₹)</label>
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
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Current Value (₹)</label>
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
          </div>

          {/* 
            CONCEPT: Derived UI feedback — no extra state needed.
            We compute whether it's profitable directly in JSX using the current input values.
          */}
          {purchasePrice !== '' && currentPrice !== '' && (
            <div className={`mt-3 text-xs font-medium px-3 py-2 rounded-lg ${
              Number(currentPrice) >= Number(purchasePrice)
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}>
              {Number(currentPrice) >= Number(purchasePrice)
                ? `▲ Gain: ₹${(Number(currentPrice) - Number(purchasePrice)).toLocaleString('en-IN')}`
                : `▼ Loss: ₹${(Number(purchasePrice) - Number(currentPrice)).toLocaleString('en-IN')}`
              }
            </div>
          )}

          <button
            type="submit"
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Add to Portfolio
          </button>
        </form>
      )}
    </div>
  );
}