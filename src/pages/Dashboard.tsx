// =============================================================
//  src/pages/Dashboard.tsx
//
//  CHANGES FROM BEFORE:
//  - Asset type imported from src/types (not from AssetCard)
//  - NewAssetPayload type used for onAddAsset
//  - Portfolio performance chart added (PortfolioChart)
//  - Asset allocation donut added (AllocationChart)
//  - Summary stat cards: total invested, current value, overall gain/loss
//  - Dummy portfolio history data for the chart
// =============================================================

import { useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCurrency } from '../context/CurrencyContext';
import AssetCard from '../components/AssetCard';
import AddAssetForm from '../components/AddAssetForm';
import PortfolioChart from '../components/charts/PortfolioChart';
import AllocationChart from '../components/charts/AllocationChart';
import type { Asset, NewAssetPayload, PortfolioDataPoint } from '../types';

// ── Seed data ───────────────────────────────────────────────
// Using the new Asset shape: both purchasePrice and currentPrice
const initialAssets: Asset[] = [
  { id: 1, name: 'Parag Parikh Flexi Cap', type: 'Mutual Fund', amount: 25000, purchasePrice: 25000, currentPrice: 31200, isProfitable: true },
  { id: 2, name: 'NIFTYBEES', type: 'ETF', amount: 15000, purchasePrice: 15000, currentPrice: 17800, isProfitable: true },
  { id: 3, name: 'HDFC Bank', type: 'Stock', amount: 8000, purchasePrice: 8000, currentPrice: 7100, isProfitable: false },
];

// Dummy chart data — will come from the backend API in Week 3
// Shape: { date: string, value: number }[]
const portfolioHistory: PortfolioDataPoint[] = [
  { date: 'Oct', value: 42000 },
  { date: 'Nov', value: 44500 },
  { date: 'Dec', value: 43200 },
  { date: 'Jan', value: 47800 },
  { date: 'Feb', value: 51000 },
  { date: 'Mar', value: 56100 },
];

export default function Dashboard() {
  const [assets, setAssets] = useLocalStorage<Asset[]>('wealth_tracker_v2', initialAssets);
  const { symbol } = useCurrency();

  // ── Handlers (cached with useCallback) ──────────────────
  const handleAddAsset = useCallback((newAssetData: NewAssetPayload) => {
    const newAsset: Asset = { ...newAssetData, id: Math.random() };
    setAssets((prev) => [...prev, newAsset]);
  }, [setAssets]);

  const handleDeleteAsset = useCallback((idToRemove: number) => {
    setAssets((prev) => prev.filter((a) => a.id !== idToRemove));
  }, [setAssets]);

  // ── Derived stats (cached with useMemo) ──────────────────
  /*
    CONCEPT: Multiple useMemo calls, each with a single responsibility.
    Each one only re-runs when `assets` changes.
    
    Java analogy: imagine these as @Transient computed fields on an entity —
    they're derived from the stored data, not stored themselves.
  */
  const totalInvested = useMemo(
    () => assets.reduce((sum, a) => sum + a.purchasePrice, 0),
    [assets]
  );

  const totalCurrentValue = useMemo(
    () => assets.reduce((sum, a) => sum + a.currentPrice, 0),
    [assets]
  );

  const totalGainLoss = useMemo(
    () => totalCurrentValue - totalInvested,
    [totalCurrentValue, totalInvested]
  );

  const gainLossPercent = useMemo(
    () => totalInvested > 0 ? ((totalGainLoss / totalInvested) * 100).toFixed(2) : '0.00',
    [totalGainLoss, totalInvested]
  );

  const isOverallProfitable = totalGainLoss >= 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Portfolio Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Track your investments across Mutual Funds, ETFs & Stocks</p>
        </div>

        {/* ── Summary stat cards ── */}
        {/*
          CONCEPT: Array of stat objects rendered with .map()
          Instead of copy-pasting 3 identical card divs, we define
          the data and map over it. DRY principle — Don't Repeat Yourself.
        */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: 'Total Invested',
              value: `${symbol}${totalInvested.toLocaleString('en-IN')}`,
              sub: null,
              color: 'text-slate-800',
            },
            {
              label: 'Current Value',
              value: `${symbol}${totalCurrentValue.toLocaleString('en-IN')}`,
              sub: null,
              color: 'text-blue-600',
            },
            {
              label: isOverallProfitable ? 'Total Gain' : 'Total Loss',
              value: `${isOverallProfitable ? '+' : ''}${symbol}${Math.abs(totalGainLoss).toLocaleString('en-IN')}`,
              sub: `${isOverallProfitable ? '+' : ''}${gainLossPercent}%`,
              color: isOverallProfitable ? 'text-emerald-600' : 'text-rose-500',
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-lg font-extrabold ${stat.color}`}>{stat.value}</p>
              {stat.sub && (
                <p className={`text-xs font-semibold mt-0.5 ${stat.color}`}>{stat.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Charts ── */}
        <PortfolioChart data={portfolioHistory} symbol={symbol} />
        <AllocationChart assets={assets} symbol={symbol} />

        {/* ── Add asset form ── */}
        <AddAssetForm onAddAsset={handleAddAsset} />

        {/* ── Holdings list ── */}
        <div>
          <h2 className="text-base font-bold text-slate-700 mb-3">
            Holdings
            <span className="ml-2 text-xs font-normal text-slate-400">{assets.length} assets</span>
          </h2>

          {assets.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg">No holdings yet</p>
              <p className="text-sm mt-1">Use the form above to log your first investment</p>
            </div>
          ) : (
            assets.map((asset) => (
              <AssetCard
                key={asset.id}
                {...asset}             // spread operator passes all Asset fields as props
                onDelete={handleDeleteAsset}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}