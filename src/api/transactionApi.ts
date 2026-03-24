// =============================================================
//  src/api/transactionApi.ts
// =============================================================

import axiosInstance from './axiosInstance';
import type { AssetType } from './assetApi';

// ── Types ────────────────────────────────────────────────────
export type TransactionType = 'SIP' | 'LUMP_SUM';

export interface TransactionPayload {
    assetName: string
    assetType: AssetType
    transactionType: TransactionType
    amount: number
    transactionDate: string
    navAtPurchase?: number   // ← add
    notes?: string
}

export interface TransactionResponse {
    id: number;
    assetName: string;
    assetType: AssetType;
    transactionType: TransactionType;
    amount: number;
    transactionDate: string;
    notes?: string;
    createdAt: string;
}

// ── API calls ────────────────────────────────────────────────
export const addTransactionApi = async (
    payload: TransactionPayload
): Promise<TransactionResponse> => {
    const response = await axiosInstance.post('/api/transactions', payload);
    return response.data.data;
};

export const getTransactionsApi = async (): Promise<TransactionResponse[]> => {
    const response = await axiosInstance.get('/api/transactions');
    return response.data.data;
};

export const deleteTransactionApi = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/transactions/${id}`);
};