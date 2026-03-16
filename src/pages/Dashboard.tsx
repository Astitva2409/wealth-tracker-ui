import { useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AssetCard, { type Asset } from '../components/AssetCard';
import AddAssetForm from '../components/AddAssetForm';

const initialAssets: Asset[] = [
  { id: 1, name: "Parag Parikh Flexi Cap", type: "Mutual Fund", amount: 25000, isProfitable: true },
  { id: 2, name: "NIFTYBEES", type: "ETF", amount: 15000, isProfitable: true },
  { id: 3, name: "HDFC Bank", type: "Stock", amount: 8000, isProfitable: false },
];

export default function Dashboard() {
  // 1. CUSTOM HOOK
  // Replaces complex useState and useEffect logic. Automatically syncs with browser localStorage.
  const [assets, setAssets] = useLocalStorage<Asset[]>('wealth_tracker_data', initialAssets);

  // 2. USE-CALLBACK (Add Function)
  // Caches this function in memory so React doesn't recreate it on every render.
  // The React Compiler requires [setAssets] in the dependency array.
  const handleAddAsset = useCallback((newAssetData: Omit<Asset, 'id'>) => {
    const newAsset: Asset = { ...newAssetData, id: Math.random() };
    
    // We use the arrow-function version of setAssets to grab the absolute latest state
    setAssets((prevAssets) => [...prevAssets, newAsset]);
  }, [setAssets]);

  // 3. USE-CALLBACK (Delete Function)
  // Same caching principle as the Add function.
  const handleDeleteAsset = useCallback((idToRemove: number) => {
    // We use .filter() to keep everything EXCEPT the one with the matching ID
    setAssets((prevAssets) => prevAssets.filter(asset => asset.id !== idToRemove));
  }, [setAssets]);

  // 4. USE-MEMO (Expensive Math)
  // Caches the total value calculation. 
  // It only re-runs the math if the 'assets' array actually changes.
  const totalValue = useMemo(() => {
    return assets.reduce((sum, currentAsset) => sum + currentAsset.amount, 0);
  }, [assets]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">My Wealth Tracker</h1>
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Portfolio</h2>
          <h1 className="text-4xl font-extrabold text-blue-600">₹{totalValue.toLocaleString('en-IN')}</h1>
        </div>

        {/* Passing our cached Add function down to the form via props */}
        <AddAssetForm onAddAsset={handleAddAsset} />

        <div>
          <h2 className="text-xl font-bold text-slate-700 mb-4">Your Holdings</h2>
          
          {/* Mapping over our assets array to render individual AssetCard components */}
          {assets.map((asset) => (
             <AssetCard 
               key={asset.id} 
               id={asset.id}
               name={asset.name}
               type={asset.type}
               amount={asset.amount}
               isProfitable={asset.isProfitable}
               // Passing our cached Delete function down to each specific card
               onDelete={handleDeleteAsset} 
             />
          ))}
        </div>
      </div>
    </div>
  );
}