// =============================================================
//  src/pages/Transactions.tsx
//
//  CONCEPTS TAUGHT IN THIS FILE:
//  1. Multiple useState for filter/sort controls
//  2. Array chaining: .filter().sort() on state
//  3. Derived data from filtered results (useMemo)
//  4. Conditional rendering: empty state, loading, data
//  5. Dynamic Tailwind classes based on state
//  6. Date formatting with Intl.DateTimeFormat
// =============================================================

import { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCurrency } from '../context/CurrencyContext';
import AddTransactionForm from '../components/AddTransactionForm';
import type {
  Transaction,
  NewTransactionPayload,
  TransactionType,
  SortField,
  SortOrder,
} from '../types';

// ── Seed data ────────────────────────────────────────────────
// Realistic dummy transactions — will come from API in Week 3
const initialTransactions: Transaction[] = [
  { id: 1, assetName: 'Parag Parikh Flexi Cap', assetType: 'Mutual Fund', type: 'SIP',      amount: 5000,  date: '2025-10-01', notes: 'Monthly SIP' },
  { id: 2, assetName: 'NIFTYBEES',              assetType: 'ETF',          type: 'Lump Sum', amount: 15000, date: '2025-10-15' },
  { id: 3, assetName: 'Parag Parikh Flexi Cap', assetType: 'Mutual Fund', type: 'SIP',      amount: 5000,  date: '2025-11-01', notes: 'Monthly SIP' },
  { id: 4, assetName: 'HDFC Bank',              assetType: 'Stock',        type: 'Lump Sum', amount: 8000,  date: '2025-11-20' },
  { id: 5, assetName: 'Parag Parikh Flexi Cap', assetType: 'Mutual Fund', type: 'SIP',      amount: 5000,  date: '2025-12-01', notes: 'Monthly SIP' },
  { id: 6, assetName: 'Mirae Asset Midcap',     assetType: 'Mutual Fund', type: 'Lump Sum', amount: 20000, date: '2025-12-10' },
  { id: 7, assetName: 'Parag Parikh Flexi Cap', assetType: 'Mutual Fund', type: 'SIP',      amount: 5000,  date: '2026-01-01', notes: 'Monthly SIP' },
  { id: 8, assetName: 'NIFTYBEES',              assetType: 'ETF',          type: 'SIP',      amount: 2000,  date: '2026-01-15' },
];

// ── Color maps — defined outside component (constants) ───────
const TYPE_COLORS: Record<TransactionType, string> = {
  'SIP':      'bg-blue-50 text-blue-700',
  'Lump Sum': 'bg-amber-50 text-amber-700',
};

const ASSET_TYPE_COLORS: Record<string, string> = {
  'Mutual Fund': 'bg-emerald-50 text-emerald-700',
  'ETF':         'bg-purple-50 text-purple-700',
  'Stock':       'bg-rose-50 text-rose-600',
};

export default function Transactions() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    'wealth_tracker_transactions',
    initialTransactions
  );
  const { symbol } = useCurrency();

  // ── Filter + Sort state ──────────────────────────────────
  // CONCEPT: Multiple useState calls for UI controls.
  // Each filter is its own piece of state — independent of the data.
  // When any of these changes, React re-renders and the derived
  // `filteredAndSorted` memo re-runs automatically.
  const [search, setSearch]         = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'All'>('All');
  const [sortField, setSortField]   = useState<SortField>('date');
  const [sortOrder, setSortOrder]   = useState<SortOrder>('desc');

  // ── Add handler ──────────────────────────────────────────
  const handleAdd = (payload: NewTransactionPayload) => {
    const newTx: Transaction = { ...payload, id: Date.now() };
    // Date.now() returns milliseconds since epoch — guaranteed unique id
    setTransactions((prev) => [newTx, ...prev]); // prepend — newest first
  };

  // ── Delete handler ───────────────────────────────────────
  const handleDelete = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Filtered + sorted list (derived from state) ──────────
  // CONCEPT: Array method chaining — .filter().sort()
  // We NEVER mutate the `transactions` array in state.
  // Instead we compute a new derived array each render.
  // useMemo caches it — only re-computes when the dependencies change.
  const filteredAndSorted = useMemo(() => {
    return transactions
      // Step 1: filter by transaction type
      .filter((t) => filterType === 'All' || t.type === filterType)

      // Step 2: filter by search text (case-insensitive asset name match)
      // CONCEPT: toLowerCase() on both sides makes search case-insensitive
      .filter((t) =>
        search === '' || t.assetName.toLowerCase().includes(search.toLowerCase())
      )

      // Step 3: sort by chosen field and order
      // CONCEPT: .sort() with a comparator function
      // If sortOrder is 'desc': subtract b from a → larger value comes first
      // If sortOrder is 'asc':  subtract a from b → smaller value comes first
      // For dates: new Date(str).getTime() converts "2025-03-15" to a number
      .sort((a, b) => {
        let valA: number;
        let valB: number;

        if (sortField === 'date') {
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
        } else {
          valA = a.amount;
          valB = b.amount;
        }

        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [transactions, filterType, search, sortField, sortOrder]);
  // ↑ dependency array — re-run when ANY of these change

  // ── Summary stats (derived from ALL transactions, not filtered) ──
  const stats = useMemo(() => {
    const totalInvested = transactions.reduce((sum, t) => sum + t.amount, 0);
    const sipTotal      = transactions.filter((t) => t.type === 'SIP').reduce((sum, t) => sum + t.amount, 0);
    const lumpTotal     = transactions.filter((t) => t.type === 'Lump Sum').reduce((sum, t) => sum + t.amount, 0);
    return { totalInvested, sipTotal, lumpTotal, count: transactions.length };
  }, [transactions]);

  // ── Sort toggle helper ────────────────────────────────────
  // CONCEPT: Toggle logic
  // If the user clicks the same field that's already selected,
  // flip the order (asc → desc or desc → asc).
  // If they click a new field, switch to that field with 'desc' default.
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // ── Sort indicator helper ─────────────────────────────────
  const sortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="text-slate-300 ml-1">↕</span>;
    return <span className="text-emerald-500 ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>;
  };

  // ── Date formatter ────────────────────────────────────────
  // CONCEPT: Intl.DateTimeFormat — built-in browser date formatting
  // No library needed. 'en-IN' locale gives Indian date format.
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      .format(new Date(iso));

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">A log of every SIP and lump-sum investment</p>
        </div>

        {/* Summary stat cards */}
        {/*
          CONCEPT: Data-driven rendering — array of objects mapped to JSX.
          Same pattern as Dashboard stat cards. DRY — Don't Repeat Yourself.
        */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total invested',  value: `${symbol}${stats.totalInvested.toLocaleString('en-IN')}`, color: 'text-slate-800' },
            { label: 'Via SIP',         value: `${symbol}${stats.sipTotal.toLocaleString('en-IN')}`,      color: 'text-blue-600'  },
            { label: 'Lump sum',        value: `${symbol}${stats.lumpTotal.toLocaleString('en-IN')}`,     color: 'text-amber-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Add form */}
        <AddTransactionForm onAdd={handleAdd} />

        {/* Filter + Search bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search input */}
            <input
              type="text"
              placeholder="Search by asset name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />

            {/* Type filter buttons */}
            {/*
              CONCEPT: Dynamic className with ternary
              The active button gets a filled style, inactive gets outline.
              No extra state — we compare filterType === value to decide.
            */}
            <div className="flex gap-2">
              {(['All', 'SIP', 'Lump Sum'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filterType === type
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Sort controls */}
          <div className="flex gap-3 mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 self-center">Sort by:</span>
            <button
              onClick={() => handleSort('date')}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                sortField === 'date' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Date {sortIcon('date')}
            </button>
            <button
              onClick={() => handleSort('amount')}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                sortField === 'amount' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Amount {sortIcon('amount')}
            </button>

            {/* Result count — updates live as filters change */}
            <span className="ml-auto text-xs text-slate-400 self-center">
              {filteredAndSorted.length} of {transactions.length}
            </span>
          </div>
        </div>

        {/* Transaction list */}
        {/*
          CONCEPT: Three-way conditional rendering
          1. No transactions at all → onboarding empty state
          2. Transactions exist but none match filters → "no results" state
          3. Results found → render the list

          This pattern (empty state → filtered empty → data) is used
          in every real-world data table.
        */}
        {transactions.length === 0 ? (
          // Empty state — no data at all
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-lg font-medium text-slate-500">No transactions yet</p>
            <p className="text-sm mt-1">Use the form above to log your first investment</p>
          </div>

        ) : filteredAndSorted.length === 0 ? (
          // Filtered empty state — data exists but nothing matches
          <div className="text-center py-12 text-slate-400">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-base font-medium text-slate-500">No transactions match your filters</p>
            <button
              onClick={() => { setSearch(''); setFilterType('All'); }}
              className="mt-3 text-sm text-emerald-600 hover:underline"
            >
              Clear filters
            </button>
          </div>

        ) : (
          // Data state — render the list
          <div className="space-y-2">
            {filteredAndSorted.map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                symbol={symbol}
                onDelete={handleDelete}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

// =============================================================
//  TransactionRow — extracted as a separate component
//
//  CONCEPT: Extract small components to keep the parent readable.
//  When a .map() callback grows beyond 3–4 lines of JSX,
//  pull it into its own named component. Benefits:
//  - Parent is easier to read
//  - Row can be tested/styled independently
//  - React can memoize it with React.memo later if needed
// =============================================================

interface TransactionRowProps {
  tx: Transaction;
  symbol: string;
  onDelete: (id: number) => void;
  formatDate: (iso: string) => string;
}

function TransactionRow({ tx, symbol, onDelete, formatDate }: TransactionRowProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">

      {/* Left: type badge + asset info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {/* Transaction type badge */}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[tx.type]}`}>
            {tx.type}
          </span>
          {/* Asset type badge */}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ASSET_TYPE_COLORS[tx.assetType]}`}>
            {tx.assetType}
          </span>
        </div>

        {/* Asset name — truncated if too long */}
        <p className="text-sm font-bold text-slate-800 truncate">{tx.assetName}</p>

        {/* Date + optional notes */}
        <p className="text-xs text-slate-400 mt-0.5">
          {formatDate(tx.date)}
          {/* CONCEPT: Short-circuit rendering with &&
              If tx.notes is truthy (non-empty string), render the span.
              If tx.notes is undefined, render nothing.
              This is cleaner than a ternary when there's no "else" branch. */}
          {tx.notes && (
            <span className="ml-2 text-slate-300">· {tx.notes}</span>
          )}
        </p>
      </div>

      {/* Right: amount + delete */}
      <div className="flex items-center gap-3 shrink-0">
        <p className="text-base font-extrabold text-slate-800">
          {symbol}{tx.amount.toLocaleString('en-IN')}
        </p>
        <button
          onClick={() => onDelete(tx.id)}
          className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
          title="Delete transaction"
        >
          ✕
        </button>
      </div>
    </div>
  );
}