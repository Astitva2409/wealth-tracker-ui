// =============================================================
//  src/components/AddTransactionForm.tsx
//
//  CONCEPTS TAUGHT IN THIS FILE:
//  1. Controlled inputs — React owns every input's value via state
//  2. Multiple useState calls — one per field
//  3. e.preventDefault() — stop browser's default form behavior
//  4. Type casting with `as` — telling TypeScript the exact type
//  5. Optional fields with fallback — notes || undefined
// =============================================================

import { useState, useRef } from 'react';
import type { NewTransactionPayload, TransactionType } from '../types';

interface AddTransactionFormProps {
  onAdd: (payload: NewTransactionPayload) => void;
}

export default function AddTransactionForm({ onAdd }: AddTransactionFormProps) {
  // ── Form field state ────────────────────────────────────────
  // CONCEPT: Controlled inputs
  // In HTML, an <input> manages its own value internally (uncontrolled).
  // In React, WE manage the value via useState — the input just displays
  // what we tell it to. This gives us full control: validation, formatting,
  // auto-clear after submit, etc.
  // Rule: value={state} + onChange={setState} = controlled input.
  const [assetName, setAssetName]   = useState('');
  const [assetType, setAssetType]   = useState<'Mutual Fund' | 'ETF' | 'Stock'>('Mutual Fund');
  const [txType, setTxType]         = useState<TransactionType>('SIP');
  const [amount, setAmount]         = useState<number | ''>('');
  const [date, setDate]             = useState('');
  const [notes, setNotes]           = useState('');
  const [isOpen, setIsOpen]         = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    // CONCEPT: e.preventDefault()
    // Without this, the browser would do a full page reload on form submit.
    // In a React SPA (Single Page Application), we NEVER want that.
    // We intercept the submit event, handle it ourselves, and stay on the page.
    e.preventDefault();
    if (!assetName || !amount || !date) return;

    const payload: NewTransactionPayload = {
      assetName: assetName.trim(),
      assetType,
      type: txType,
      amount: Number(amount),
      date,
      // CONCEPT: Optional field with conditional assignment
      // notes?.trim() safely calls .trim() only if notes is not null/undefined
      // || undefined converts empty string '' to undefined
      // so we don't store empty-string notes in our data
      notes: notes.trim() || undefined,
    };

    onAdd(payload);

    // Reset form fields to empty after submission
    setAssetName('');
    setAssetType('Mutual Fund');
    setTxType('SIP');
    setAmount('');
    setDate('');
    setNotes('');
    setIsOpen(false);

    // Bring focus back to first input — good UX for rapid entry
    setTimeout(() => firstInputRef.current?.focus(), 50);
  };

  // ── Render ─────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full border-2 border-dashed border-slate-300 hover:border-emerald-400 text-slate-400 hover:text-emerald-600 p-4 rounded-xl transition-colors font-medium mb-6"
      >
        + Log New Transaction
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-slate-700">Log New Transaction</h2>
        <button
          type="button" // IMPORTANT: type="button" prevents this from submitting the form
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 text-lg"
        >✕</button>
      </div>

      <div className="grid grid-cols-1 gap-3">

        {/* Asset name */}
        <input
          ref={firstInputRef}
          type="text"
          placeholder="Asset name (e.g. Parag Parikh Flexi Cap)"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
          className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
          required
        />

        {/* Asset type + Transaction type — side by side on wider screens */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Asset type</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as 'Mutual Fund' | 'ETF' | 'Stock')}
              className="border border-slate-200 bg-slate-50 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
            >
              <option value="Mutual Fund">Mutual Fund</option>
              <option value="ETF">ETF</option>
              <option value="Stock">Stock</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Transaction type</label>
            {/*
              CONCEPT: Type casting with `as`
              e.target.value is typed as `string` by TypeScript.
              But we KNOW it can only be 'SIP' or 'Lump Sum' because those
              are the only <option> values. We tell TypeScript to trust us
              using `as TransactionType`. Use `as` only when YOU know more
              than TypeScript does. Java equivalent: explicit casting (Type) value.
            */}
            <select
              value={txType}
              onChange={(e) => setTxType(e.target.value as TransactionType)}
              className="border border-slate-200 bg-slate-50 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
            >
              <option value="SIP">SIP (Monthly)</option>
              <option value="Lump Sum">Lump Sum</option>
            </select>
          </div>
        </div>

        {/* Amount + Date — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
              min="1"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
              required
            />
          </div>
        </div>

        {/* Optional notes */}
        <input
          type="text"
          placeholder="Notes (optional — e.g. Monthly SIP instalment)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
      >
        Add Transaction
      </button>
    </form>
  );
}