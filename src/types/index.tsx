// =============================================================
//  src/types/index.ts
//  Single source of truth for ALL TypeScript types.
//  Every component imports types from HERE, not from each other.
// =============================================================

export interface Asset {
  id: number;
  name: string;
  type: 'Mutual Fund' | 'ETF' | 'Stock';
  amount: number;
  purchasePrice: number;
  currentPrice: number;
  isProfitable: boolean;
}

export type NewAssetPayload = Omit<Asset, 'id'>;

// ── Transaction ──────────────────────────────────────────────

// CONCEPT: Type aliases for union types
// Instead of writing 'SIP' | 'Lump Sum' everywhere,
// we name it TransactionType. Change it in one place = changes everywhere.
export type TransactionType = 'SIP' | 'Lump Sum';
export type SortField      = 'date' | 'amount';
export type SortOrder      = 'asc'  | 'desc';

export interface Transaction {
  id: number;
  assetName: string;
  assetType: 'Mutual Fund' | 'ETF' | 'Stock';
  type: TransactionType;
  amount: number;
  date: string;    // ISO date string e.g. "2025-03-15"
  notes?: string;  // the ? means this field is OPTIONAL
}

// Omit<Transaction, 'id'> = Transaction shape but without the id field
// Used in the form — parent generates the id after form submission
export type NewTransactionPayload = Omit<Transaction, 'id'>;

// ── Chart ────────────────────────────────────────────────────
export interface PortfolioDataPoint {
  date: string;
  value: number;
}