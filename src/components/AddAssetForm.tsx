import { useState, useRef } from 'react';
import type { Asset } from './AssetCard'; // Import the Asset interface
// Import the Asset interface

// 1. DEFINE THE PROPS INTERFACE
// We tell TypeScript: "This component expects a function called onAddAsset"
// Omit<Asset, 'id'> means it expects an Asset object, but without the 'id' field (since the parent generates the ID)
interface AddAssetFormProps {
    onAddAsset: (asset: Omit<Asset, 'id'>) => void;
}

// 2. DESTRUCTURE THE PROP
export default function AddAssetForm({ onAddAsset }: AddAssetFormProps) {
    const [name, setName] = useState<string>('');
    const [amount, setAmount] = useState<number | ''>('');
    const [type, setType] = useState<'Mutual Fund' | 'ETF' | 'Stock'>('Mutual Fund');

    const nameInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if fields are empty
        if (!name || !amount) return;

        const newInvestment = {
            name: name,
            amount: Number(amount),
            type: type,
            isProfitable: true
        };

        // 3. CALL THE PARENT'S FUNCTION!
        // We pass the data UP to App.tsx
        onAddAsset(newInvestment);

        // Clear the form
        setName('');
        setAmount('');
        setType('Mutual Fund');

        nameInputRef.current?.focus();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Log New Investment</h2>

            <input
                type="text"
                placeholder="Asset Name (e.g., HDFC Midcap)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-slate-300 p-2 rounded-lg w-full mb-3"
                required
                ref={nameInputRef}
            />

            <input
                type="number"
                placeholder="Amount invested (₹)"
                value={amount}
                onChange={(e) => {
                    const value = e.target.value;
                    setAmount(value === '' ? '' : Number(value));
                }}
                className="border border-slate-300 p-2 rounded-lg w-full mb-3"
                required
            />

            <select
                value={type}
                onChange={(e) => setType(e.target.value as 'Mutual Fund' | 'ETF' | 'Stock')}
                className="border border-slate-300 p-2 rounded-lg w-full mb-4 bg-white"
            >
                <option value="Mutual Fund">Mutual Fund</option>
                <option value="ETF">ETF</option>
                <option value="Stock">Stock</option>
            </select>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Add to Portfolio
            </button>
        </form>
    );
}