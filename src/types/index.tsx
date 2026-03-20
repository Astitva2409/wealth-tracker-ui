// =============================================================
//  src/types/index.ts
//  THE SINGLE SOURCE OF TRUTH for all shared TypeScript types.
//
//  WHY THIS FILE EXISTS:
//  Before, the Asset type lived inside AssetCard.tsx and
//  Dashboard.tsx had to do a weird import like:
//    import AssetCard, { type Asset } from '../components/AssetCard'
//
//  That makes a UI component the owner of a data contract — wrong.
//  Any file that needs a type imports from HERE, not from a component.
// =============================================================

export interface Asset {
  id: number;
  name: string;
  type: 'Mutual Fund' | 'ETF' | 'Stock';
  amount: number;
  purchasePrice: number;   // NEW: what you paid originally
  currentPrice: number;    // NEW: what it's worth today
  isProfitable: boolean;   // computed: currentPrice > purchasePrice
}

// Omit<Asset, 'id'> means "Asset but without the id field"
// We use this for the AddAssetForm because the parent (Dashboard) assigns the id
export type NewAssetPayload = Omit<Asset, 'id'>;

// A single transaction entry (SIP or lump-sum)
export interface Transaction {
  id: number;
  assetName: string;
  type: 'SIP' | 'Lump Sum';
  amount: number;
  date: string; // ISO date string e.g. "2024-03-15"
}

// A data point for the portfolio performance chart
export interface PortfolioDataPoint {
  date: string;   // e.g. "Jan", "Feb"
  value: number;  // total portfolio value on that date
}