// =============================================================
//  src/components/skeletons/Skeletons.tsx

// ── Base skeleton block ──────────────────────────────────────
// A single animated placeholder rectangle
// All other skeletons are built from this
function SkeletonBlock({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
    );
}

// ── Stat card skeleton ───────────────────────────────────────
function StatCardSkeleton() {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <SkeletonBlock className="h-3 w-24 mb-3" />
            <SkeletonBlock className="h-7 w-32" />
        </div>
    );
}

// ── Asset card skeleton ──────────────────────────────────────
function AssetCardSkeleton() {
    return (
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center mb-3">
            <div className="flex flex-col gap-2">
                <SkeletonBlock className="h-4 w-48" />
                <SkeletonBlock className="h-3 w-20" />
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col gap-2">
                    <SkeletonBlock className="h-3 w-16" />
                    <SkeletonBlock className="h-4 w-20" />
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <SkeletonBlock className="h-3 w-16" />
                    <SkeletonBlock className="h-5 w-24" />
                </div>
            </div>
        </div>
    );
}

// ── Chart skeleton ───────────────────────────────────────────
function ChartSkeleton() {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
            <SkeletonBlock className="h-3 w-40 mb-4" />
            <SkeletonBlock className="h-52 w-full" />
        </div>
    );
}

// ── Transaction row skeleton ─────────────────────────────────
function TransactionRowSkeleton() {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4 mb-2">
            <div className="flex-1 flex flex-col gap-2">
                <div className="flex gap-2">
                    <SkeletonBlock className="h-5 w-12 rounded-full" />
                    <SkeletonBlock className="h-5 w-20 rounded-full" />
                </div>
                <SkeletonBlock className="h-4 w-48" />
                <SkeletonBlock className="h-3 w-28" />
            </div>
            <SkeletonBlock className="h-6 w-20" />
        </div>
    );
}

// ── Full Dashboard skeleton ──────────────────────────────────
// Matches the exact layout of Dashboard.tsx
export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="max-w-2xl mx-auto px-4 py-8">

                {/* Page header */}
                <div className="mb-8">
                    <SkeletonBlock className="h-7 w-56 mb-2" />
                    <SkeletonBlock className="h-4 w-80" />
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>

                {/* Charts */}
                <ChartSkeleton />
                <ChartSkeleton />

                {/* Holdings header */}
                <SkeletonBlock className="h-5 w-24 mb-3" />

                {/* Asset cards */}
                <AssetCardSkeleton />
                <AssetCardSkeleton />
                <AssetCardSkeleton />
            </div>
        </div>
    );
}

// ── Full Transactions skeleton ───────────────────────────────
export function TransactionsSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="max-w-2xl mx-auto px-4 py-8">

                {/* Page header */}
                <div className="mb-8">
                    <SkeletonBlock className="h-7 w-44 mb-2" />
                    <SkeletonBlock className="h-4 w-72" />
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>

                {/* Filter bar skeleton */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
                    <SkeletonBlock className="h-10 w-full mb-3" />
                    <SkeletonBlock className="h-8 w-48" />
                </div>

                {/* Transaction rows */}
                <TransactionRowSkeleton />
                <TransactionRowSkeleton />
                <TransactionRowSkeleton />
                <TransactionRowSkeleton />
            </div>
        </div>
    );
}