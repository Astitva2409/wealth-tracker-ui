// =============================================================
//  src/pages/Transactions.tsx

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrency } from '../context/CurrencyContext';
import AddTransactionForm from '../components/AddTransactionForm';
import {
    getTransactionsApi,
    addTransactionApi,
    deleteTransactionApi,
    type TransactionPayload,
    type TransactionResponse,
    type TransactionType,
} from '../api/transactionApi';
import { TransactionsSkeleton } from '../components/skeletons/Skeletons';

// ── Display maps ─────────────────────────────────────────────
const TX_TYPE_COLORS: Record<TransactionType, string> = {
    'SIP': 'bg-blue-50 text-blue-700',
    'LUMP_SUM': 'bg-amber-50 text-amber-700',
};

const TX_TYPE_DISPLAY: Record<TransactionType, string> = {
    'SIP': 'SIP',
    'LUMP_SUM': 'Lump Sum',
};

const ASSET_TYPE_COLORS: Record<string, string> = {
    'MUTUAL_FUND': 'bg-emerald-50 text-emerald-700',
    'ETF': 'bg-purple-50 text-purple-700',
    'STOCK': 'bg-rose-50 text-rose-600',
};

const ASSET_TYPE_DISPLAY: Record<string, string> = {
    'MUTUAL_FUND': 'Mutual Fund',
    'ETF': 'ETF',
    'STOCK': 'Stock',
};

type SortField = 'transactionDate' | 'amount';
type SortOrder = 'asc' | 'desc';

export default function Transactions() {
    const { symbol } = useCurrency();
    const queryClient = useQueryClient();

    // ── Filter + Sort state ──────────────────────────────────
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<TransactionType | 'All'>('All');
    const [sortField, setSortField] = useState<SortField>('transactionDate');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // ── Fetch transactions ────────────────────────────────────
    const {
        data: transactions = [],
        isLoading,
        isError,
    } = useQuery<TransactionResponse[]>({
        queryKey: ['transactions'],
        queryFn: getTransactionsApi,
    });

    // ── Add mutation ──────────────────────────────────────────
    const addMutation = useMutation({
        mutationFn: (payload: TransactionPayload) => addTransactionApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    // ── Delete mutation ───────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteTransactionApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    // ── Filter + Sort (pure frontend — same as Week 1) ────────
    const filteredAndSorted = useMemo(() => {
        return transactions
            .filter((t) => filterType === 'All' || t.transactionType === filterType)
            .filter((t) =>
                search === '' ||
                t.assetName.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
                const valA = sortField === 'transactionDate'
                    ? new Date(a.transactionDate).getTime()
                    : a.amount;
                const valB = sortField === 'transactionDate'
                    ? new Date(b.transactionDate).getTime()
                    : b.amount;
                return sortOrder === 'desc' ? valB - valA : valA - valB;
            });
    }, [transactions, filterType, search, sortField, sortOrder]);

    // ── Summary stats ─────────────────────────────────────────
    const stats = useMemo(() => {
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        const sipSum = transactions.filter(t => t.transactionType === 'SIP')
            .reduce((sum, t) => sum + t.amount, 0);
        const lumpSum = transactions.filter(t => t.transactionType === 'LUMP_SUM')
            .reduce((sum, t) => sum + t.amount, 0);
        return { total, sipSum, lumpSum };
    }, [transactions]);

    // ── Sort toggle ───────────────────────────────────────────
    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const sortIcon = (field: SortField) => {
        if (sortField !== field) return <span className="text-slate-300 ml-1">↕</span>;
        return <span className="text-emerald-500 ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>;
    };

    // ── Date formatter ────────────────────────────────────────
    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        }).format(new Date(iso));

    // ── Loading state ─────────────────────────────────────────
    if (isLoading) {
        return <TransactionsSkeleton />;
    }

    // ── Error state ───────────────────────────────────────────
    if (isError) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-rose-500 text-sm">Failed to load transactions. Please refresh.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="max-w-2xl mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        A log of every SIP and lump-sum investment
                    </p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Total invested', value: `${symbol}${stats.total.toLocaleString('en-IN')}`, color: 'text-slate-800' },
                        { label: 'Via SIP', value: `${symbol}${stats.sipSum.toLocaleString('en-IN')}`, color: 'text-blue-600' },
                        { label: 'Lump sum', value: `${symbol}${stats.lumpSum.toLocaleString('en-IN')}`, color: 'text-amber-600' },
                    ].map((s) => (
                        <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
                            <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Add form */}
                <AddTransactionForm
                    onAdd={(payload) => addMutation.mutate(payload)}
                    isLoading={addMutation.isPending}
                />

                {/* Filter + Search */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Search by asset name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        />
                        <div className="flex gap-2">
                            {(['All', 'SIP', 'LUMP_SUM'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterType === type
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {type === 'LUMP_SUM' ? 'Lump Sum' : type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400 self-center">Sort by:</span>
                        <button
                            onClick={() => handleSort('transactionDate')}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${sortField === 'transactionDate'
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            Date {sortIcon('transactionDate')}
                        </button>
                        <button
                            onClick={() => handleSort('amount')}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${sortField === 'amount'
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            Amount {sortIcon('amount')}
                        </button>
                        <span className="ml-auto text-xs text-slate-400 self-center">
                            {filteredAndSorted.length} of {transactions.length}
                        </span>
                    </div>
                </div>

                {/* Transaction list */}
                {transactions.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <p className="text-4xl mb-3">📋</p>
                        <p className="text-lg font-medium text-slate-500">No transactions yet</p>
                        <p className="text-sm mt-1">Use the form above to log your first investment</p>
                    </div>
                ) : filteredAndSorted.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <p className="text-3xl mb-3">🔍</p>
                        <p className="text-base font-medium text-slate-500">
                            No transactions match your filters
                        </p>
                        <button
                            onClick={() => { setSearch(''); setFilterType('All'); }}
                            className="mt-3 text-sm text-emerald-600 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredAndSorted.map((tx) => (
                            <div key={tx.id}
                                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TX_TYPE_COLORS[tx.transactionType]}`}>
                                            {TX_TYPE_DISPLAY[tx.transactionType]}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ASSET_TYPE_COLORS[tx.assetType]}`}>
                                            {ASSET_TYPE_DISPLAY[tx.assetType]}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-800 truncate">
                                        {tx.assetName}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {formatDate(tx.transactionDate)}
                                        {tx.notes && (
                                            <span className="ml-2 text-slate-300">· {tx.notes}</span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <p className="text-base font-extrabold text-slate-800">
                                        {symbol}{tx.amount.toLocaleString('en-IN')}
                                    </p>
                                    <button
                                        onClick={() => deleteMutation.mutate(tx.id)}
                                        disabled={deleteMutation.isPending}
                                        className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                                        title="Delete transaction"
                                    >✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}