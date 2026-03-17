// 1. Import our custom VIP badge
import { useCurrency } from '../context/CurrencyContext';

export default function Settings() {
  // 2. Use the badge to grab exactly what we need from the mailroom
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-700 mb-4">Display Currency</h2>
          
          <div className="flex gap-4">
            {/* 3. Button to set currency to INR */}
            <button 
              onClick={() => setCurrency('INR')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currency === 'INR' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Indian Rupee (INR)
            </button>

            {/* 4. Button to set currency to USD */}
            <button 
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currency === 'USD' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              US Dollar (USD)
            </button>
          </div>
          
          <p className="text-sm text-slate-500 mt-4">
            Current active currency: <span className="font-bold text-slate-700">{currency}</span>
          </p>
        </div>
      </div>
    </div>
  );
}