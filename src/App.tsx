import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import AssetCard, { type Asset } from "./components/AssetCard";
import AddAssetForm from "./components/AddAssetForm";

const initialAssets: Asset[] = [
  {
    id: 1,
    name: "Parag Parikh Flexi Cap",
    type: "Mutual Fund",
    amount: 25000,
    isProfitable: true,
  },
  { id: 2, name: "NIFTYBEES", type: "ETF", amount: 15000, isProfitable: true },
  {
    id: 3,
    name: "HDFC Bank",
    type: "Stock",
    amount: 8000,
    isProfitable: false,
  },
];

function App() {
  const [assets, setAssets] = useLocalStorage<Asset[]>("wealth_tracker_data", initialAssets);

  // A dummy state just to force the component to re-render
  // const [isDarkMode, setIsDarkMode] = useState(false);

  const handleAddAsset = useCallback((newAssetData: Omit<Asset, 'id'>) => {
    const newAsset: Asset = { ...newAssetData, id: Math.random() };
    
    // Notice how we use the arrow-function version of setAssets here?
    // This ensures we always get the LATEST assets array, even if the function itself is cached!
    setAssets((prevAssets) => [...prevAssets, newAsset]);
  }, [setAssets]);

  // 1. THE DELETE FUNCTION
  // It expects a number (the ID of the asset we want to remove)
  // Wrap the delete function too
  const handleDeleteAsset = useCallback((idToRemove: number) => {
    setAssets((prevAssets) => prevAssets.filter(asset => asset.id !== idToRemove));
  }, [setAssets]);

  const totalValue = useMemo(() => {
    console.log("Expensive math running! Recalculating total...");

    return assets.reduce((sum, currentAsset) => sum + currentAsset.amount, 0);

  }, [assets]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          My Wealth Tracker
        </h1>
        {/* <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="mb-4 bg-slate-200 p-2 rounded"
        >
          Toggle Theme (Forces Re-render)
        </button> */}

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Portfolio
          </h2>
          <h1 className="text-4xl font-extrabold text-blue-600">
            ₹{totalValue.toLocaleString("en-IN")}
          </h1>
        </div>

        <AddAssetForm onAddAsset={handleAddAsset} />

        <div>
          <h2 className="text-xl font-bold text-slate-700 mb-4">
            Your Holdings
          </h2>

          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              id={asset.id}
              name={asset.name}
              type={asset.type}
              amount={asset.amount}
              isProfitable={asset.isProfitable}
              onDelete={handleDeleteAsset}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;