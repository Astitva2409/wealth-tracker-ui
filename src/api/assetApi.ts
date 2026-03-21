// =============================================================
//  src/api/assetApi.ts
// =============================================================

import axiosInstance from './axiosInstance';

// ── Types ────────────────────────────────────────────────────
// These match the backend DTOs exactly

export type AssetType = 'MUTUAL_FUND' | 'ETF' | 'STOCK';

// CONCEPT: mapping backend enum names to frontend display strings
// Backend uses MUTUAL_FUND, frontend displays "Mutual Fund"
export const ASSET_TYPE_DISPLAY: Record<AssetType, string> = {
    MUTUAL_FUND: 'Mutual Fund',
    ETF: 'ETF',
    STOCK: 'Stock',
};

export interface AssetPayload {
    name: string;
    assetType: AssetType;
    purchasePrice: number;
    currentPrice: number;
}

export interface AssetResponse {
    id: number;
    name: string;
    assetType: AssetType;
    purchasePrice: number;
    currentPrice: number;
    isProfitable: boolean;
    gainLoss: number;
    createdAt: string;
}

export interface PortfolioSummary {
    totalInvested: number;
    totalCurrentValue: number;
    totalGainLoss: number;
    gainLossPercent: number;
    totalAssets: number;
}

// ── API calls ────────────────────────────────────────────────
export const addAssetApi = async (payload: AssetPayload): Promise<AssetResponse> => {
    const response = await axiosInstance.post('/api/assets', payload);
    return response.data.data;
};

export const getAssetsApi = async (): Promise<AssetResponse[]> => {
    const response = await axiosInstance.get('/api/assets');
    return response.data.data;
};

export const updateAssetApi = async (
    id: number,
    payload: AssetPayload
): Promise<AssetResponse> => {
    const response = await axiosInstance.put(`/api/assets/${id}`, payload);
    return response.data.data;
};

export const deleteAssetApi = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/assets/${id}`);
};

export const getPortfolioSummaryApi = async (): Promise<PortfolioSummary> => {
    const response = await axiosInstance.get('/api/assets/summary');
    return response.data.data;
};