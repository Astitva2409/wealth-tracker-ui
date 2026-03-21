// =============================================================
//  src/components/AddTransactionForm.tsx

import { useState, useRef } from 'react';
import type { TransactionPayload, TransactionType } from '../api/transactionApi';
import type { AssetType } from '../api/assetApi';

interface AddTransactionFormProps {
    onAdd: (payload: TransactionPayload) => void;
    isLoading: boolean;
}

export default function AddTransactionForm({ onAdd, isLoading }: AddTransactionFormProps) {
    const [assetName, setAssetName]   = useState('');
    const [assetType, setAssetType]   = useState<AssetType>('MUTUAL_FUND');
    const [txType, setTxType]         = useState<TransactionType>('SIP');
    const [amount, setAmount]         = useState<number | ''>('');
    const [date, setDate]             = useState('');
    const [notes, setNotes]           = useState('');
    const [isOpen, setIsOpen]         = useState(false);

    const firstInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assetName || !amount || !date) return;

        onAdd({
            assetName: assetName.trim(),
            assetType,
            transactionType: txType,
            amount: Number(amount),
            transactionDate: date,
            notes: notes.trim() || undefined,
        });

        setAssetName('');
        setAssetType('MUTUAL_FUND');
        setTxType('SIP');
        setAmount('');
        setDate('');
        setNotes('');
        setIsOpen(false);
        setTimeout(() => firstInputRef.current?.focus(), 50);
    };

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
        <form onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">

            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-slate-700">Log New Transaction</h2>
                <button type="button" onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <input
                    ref={firstInputRef}
                    type="text"
                    placeholder="Asset name (e.g. Parag Parikh Flexi Cap)"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
                    required
                />

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">
                            Asset type
                        </label>
                        <select
                            value={assetType}
                            onChange={(e) => setAssetType(e.target.value as AssetType)}
                            className="border border-slate-200 bg-slate-50 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
                        >
                            <option value="MUTUAL_FUND">Mutual Fund</option>
                            <option value="ETF">ETF</option>
                            <option value="STOCK">Stock</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">
                            Transaction type
                        </label>
                        <select
                            value={txType}
                            onChange={(e) => setTxType(e.target.value as TransactionType)}
                            className="border border-slate-200 bg-slate-50 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
                        >
                            {/* Values match backend enum names */}
                            <option value="SIP">SIP (Monthly)</option>
                            <option value="LUMP_SUM">Lump Sum</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">
                            Amount (₹)
                        </label>
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
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
                            required
                        />
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
            >
                {isLoading ? 'Adding...' : 'Add Transaction'}
            </button>
        </form>
    );
}