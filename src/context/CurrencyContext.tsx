/* eslint-disable react-refresh/only-export-components */
// ^^^ THE FIX: We tell Vite's linter to relax for this specific file.

import { createContext, useState, type ReactNode, useContext } from 'react';

interface CurrencyContextType {
  currency: string;
  symbol: string;
  setCurrency: (newCurrency: string) => void;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>('INR');
  const symbol = currency === 'INR' ? '₹' : '$';

  const storeValue = {
    currency: currency,
    symbol: symbol,
    setCurrency: setCurrencyState
  };

  return (
    <CurrencyContext.Provider value={storeValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Instead of making our pages import useContext AND CurrencyContext,
// we build a simple custom hook they can use directly!
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}