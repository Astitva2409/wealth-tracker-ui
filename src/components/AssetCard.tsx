import { useCurrency } from "../context/CurrencyContext";

export interface Asset {
  id: number;
  name: string;
  type: 'Mutual Fund' | 'ETF' | 'Stock';
  amount: number;
  isProfitable: boolean;
}

// 1. THE NEW COMPONENT RULEBOOK
// We say: "Take everything from the Asset interface, and add an onDelete function."
interface AssetCardProps extends Asset {
  onDelete: (id: number) => void;
}

// 2. DESTRUCTURE THE NEW PROP
export default function AssetCard({ id, name, type, amount, isProfitable, onDelete }: AssetCardProps) {
  const { symbol } = useCurrency();
  
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex justify-between items-center mb-3 hover:shadow-md transition-shadow">
      
      <div>
        <h3 className="text-lg font-bold text-slate-800">{name}</h3>
        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
          {type}
        </span>
      </div>

      {/* We group the price and the delete button together on the right side */}
      <div className="text-right flex items-center gap-4">
        <div>
          <p className="text-sm text-slate-500 mb-1">Current Value</p>
          <p className={`text-lg font-bold ${isProfitable ? 'text-emerald-600' : 'text-rose-600'}`}>
            { symbol }{amount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* 3. THE DELETE BUTTON */}
        <button 
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors"
          title="Delete Asset"
        >
          {/* A simple text 'X' acting as an icon */}
          ✕
        </button>
      </div>

    </div>
  );
}