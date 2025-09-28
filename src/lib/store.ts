import { create } from 'zustand';
import { Asset, KYCData, Holding, Document } from './demo';

interface AppState {
  // KYC State
  kycStatus: 'not-started' | 'pending' | 'approved' | 'rejected';
  kycData: Partial<KYCData>;
  setKycStatus: (status: 'not-started' | 'pending' | 'approved' | 'rejected') => void;
  setKycData: (data: Partial<KYCData>) => void;
  
  // Assets State
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  
  // Holdings State
  holdings: Holding[];
  updateHolding: (assetId: string, amount: number) => void;
  
  // Documents State
  documents: Document[];
  addDocument: (doc: Document) => void;
  
  // Whitelist State
  whitelistAddresses: string[];
  addToWhitelist: (address: string) => void;
  removeFromWhitelist: (address: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // KYC State
  kycStatus: 'not-started',
  kycData: {},
  setKycStatus: (status) => set({ kycStatus: status }),
  setKycData: (data) => set((state) => ({ kycData: { ...state.kycData, ...data } })),
  
  // Assets State
  assets: [],
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
  
  // Holdings State
  holdings: [],
  updateHolding: (assetId, amount) => set((state) => ({
    holdings: state.holdings.map(h => 
      h.assetId === assetId ? { ...h, amount } : h
    )
  })),
  
  // Documents State
  documents: [],
  addDocument: (doc) => set((state) => ({ documents: [...state.documents, doc] })),
  
  // Whitelist State
  whitelistAddresses: [
    '0x111111111111111111111111111111111111111111',
    '0x742d35Cc1371d8e5aa7B4f2c6B50d46e',
    '0x222222222222222222222222222222222222222222'
  ],
  addToWhitelist: (address) => set((state) => ({
    whitelistAddresses: [...state.whitelistAddresses, address]
  })),
  removeFromWhitelist: (address) => set((state) => ({
    whitelistAddresses: state.whitelistAddresses.filter(a => a !== address)
  })),
}));