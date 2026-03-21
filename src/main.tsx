// =============================================================
//  src/main.tsx
//
//  WHAT CHANGED FROM WEEK 1:
//  Added QueryClient + QueryClientProvider from React Query.
//  This wraps the entire app so any component can use
//  useQuery() and useMutation() hooks.
//
//  CONCEPT: QueryClient
//  React Query maintains a cache of all API responses.
//  When two components fetch the same data, React Query
//  only makes ONE network request and shares the result.
//  No duplicate calls, no prop drilling.
// =============================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Single QueryClient instance for the whole app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 min — don't refetch if data is fresh
      gcTime: 1000 * 60 * 10,    // 10 min — keep in cache even if unused
      retry: 1,                  // retry once before showing error
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CurrencyProvider>
            <App />
          </CurrencyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);