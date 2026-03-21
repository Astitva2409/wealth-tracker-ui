// =============================================================
//  src/pages/Dashboard.tsx

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrency } from '../context/CurrencyContext';
import AssetCard from '../components/AssetCard';
import AddAssetForm from '../components/AddAssetForm';
import PortfolioChart from '../components/charts/PortfolioChart';
import AllocationChart from '../components/charts/AllocationChart';
import {
    getAssetsApi,
    getPortfolioSummaryApi,
    addAssetApi,
    deleteAssetApi,
    type AssetPayload,
    type AssetResponse,
} from '../api/assetApi';
import type { PortfolioDataPoint } from '../types';
import { DashboardSkeleton } from '../components/skeletons/Skeletons';

const portfolioHistory: PortfolioDataPoint[] = [
    { date: 'Oct', value: 42000 },
    { date: 'Nov', value: 44500 },
    { date: 'Dec', value: 43200 },
    { date: 'Jan', value: 47800 },
    { date: 'Feb', value: 51000 },
    { date: 'Mar', value: 56100 },
];

export default function Dashboard() {
    const { symbol } = useCurrency();

    // QueryClient lets us invalidate (refresh) cached data after mutations
    const queryClient = useQueryClient();

    // ── Fetch assets ─────────────────────────────────────────
    // CONCEPT: useQuery
    // queryKey: unique identifier for this query in the cache
    // queryFn: the async function that fetches the data
    // React Query handles loading, error, and caching automatically
    const {
        data: assets = [],
        isLoading: assetsLoading,
        isError: assetsError,
    } = useQuery<AssetResponse[]>({
        queryKey: ['assets'],
        queryFn: getAssetsApi,
    });

    // ── Fetch portfolio summary ───────────────────────────────
    const {
        data: summary,
        isLoading: summaryLoading,
    } = useQuery({
        queryKey: ['portfolio-summary'],
        queryFn: getPortfolioSummaryApi,
    });

    // ── Add asset mutation ────────────────────────────────────
    // CONCEPT: useMutation
    // For operations that CHANGE data (POST, PUT, DELETE)
    // onSuccess: invalidate the cache so useQuery refetches automatically
    const addAssetMutation = useMutation({
        mutationFn: (payload: AssetPayload) => addAssetApi(payload),
        onSuccess: () => {
            // Tell React Query the assets and summary caches are stale
            // It will automatically refetch both in the background
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
        },
    });

    // ── Delete asset mutation ─────────────────────────────────
    const deleteAssetMutation = useMutation({
        mutationFn: (id: number) => deleteAssetApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
        },
    });

    // ── Handlers ─────────────────────────────────────────────
    const handleAddAsset = (payload: AssetPayload) => {
        addAssetMutation.mutate(payload);
    };

    const handleDeleteAsset = (id: number) => {
        deleteAssetMutation.mutate(id);
    };

    // ── Derived stats from summary ────────────────────────────
    // summary comes from backend — already computed server-side
    const isOverallProfitable = (summary?.totalGainLoss ?? 0) >= 0;

    // AllocationChart needs assets in a shape it understands
    // We adapt AssetResponse to what AllocationChart expects
    const assetsForChart = useMemo(() => assets.map(a => ({
        id: a.id,
        name: a.name,
        type: a.assetType,
        amount: a.purchasePrice,
        purchasePrice: a.purchasePrice,
        currentPrice: a.currentPrice,
        isProfitable: a.isProfitable,
    })), [assets]);

    // ── Loading state ─────────────────────────────────────────
    if (assetsLoading || summaryLoading) {
        return <DashboardSkeleton />;
    }

    // ── Error state ───────────────────────────────────────────
    if (assetsError) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-rose-500 text-sm">Failed to load portfolio. Please refresh.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="max-w-2xl mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Portfolio Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">Track your investments across Mutual Funds, ETFs & Stocks</p>
                </div>

                {/* Summary stat cards — data from backend */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        {
                            label: 'Total Invested',
                            value: `${symbol}${(summary?.totalInvested ?? 0).toLocaleString('en-IN')}`,
                            color: 'text-slate-800',
                        },
                        {
                            label: 'Current Value',
                            value: `${symbol}${(summary?.totalCurrentValue ?? 0).toLocaleString('en-IN')}`,
                            color: 'text-blue-600',
                        },
                        {
                            label: isOverallProfitable ? 'Total Gain' : 'Total Loss',
                            value: `${isOverallProfitable ? '+' : ''}${symbol}${Math.abs(summary?.totalGainLoss ?? 0).toLocaleString('en-IN')}`,
                            sub: `${isOverallProfitable ? '+' : ''}${(summary?.gainLossPercent ?? 0).toFixed(2)}%`,
                            color: isOverallProfitable ? 'text-emerald-600' : 'text-rose-500',
                        },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className={`text-lg font-extrabold ${stat.color}`}>{stat.value}</p>
                            {'sub' in stat && stat.sub && (
                                <p className={`text-xs font-semibold mt-0.5 ${stat.color}`}>{stat.sub}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <PortfolioChart data={portfolioHistory} symbol={symbol} />
                <AllocationChart assets={assetsForChart} symbol={symbol} />

                {/* Add form */}
                <AddAssetForm
                    onAddAsset={handleAddAsset}
                    isLoading={addAssetMutation.isPending}
                />

                {/* Holdings */}
                <div>
                    <h2 className="text-base font-bold text-slate-700 mb-3">
                        Holdings
                        <span className="ml-2 text-xs font-normal text-slate-400">
                            {assets.length} assets
                        </span>
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
                                {...asset}
                                onDelete={handleDeleteAsset}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}