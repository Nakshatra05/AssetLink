// Mock data and functions for AssetLink demo

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  jurisdiction: string;
  totalSupply: number;
  price: number;
  chain: string;
  contractAddress: string;
}

export interface KYCData {
  address: string;
  name: string;
  country: string;
  taxId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

export interface Holding {
  assetId: string;
  assetName: string;
  symbol: string;
  amount: number;
  chain: string;
  value: number;
}

export interface Document {
  cid: string;
  name: string;
  hash: string;
  uploadedAt: Date;
  issuer: string;
  verified: boolean;
}

// Demo assets
export const demoAssets: Asset[] = [
  {
    id: '1',
    name: 'Kadena Tower REIT',
    symbol: 'KTREIT',
    type: 'Real Estate',
    jurisdiction: 'Delaware, USA',
    totalSupply: 1000000,
    price: 25.50,
    chain: 'Chainweb EVM',
    contractAddress: '0xDemo123...KadenaRealty'
  },
  {
    id: '2', 
    name: 'Green Energy Fund',
    symbol: 'GEFUND',
    type: 'Energy Infrastructure',
    jurisdiction: 'Wyoming, USA',
    totalSupply: 500000,
    price: 12.75,
    chain: 'Ethereum',
    contractAddress: '0xDemo456...GreenEnergy'
  }
];

// Demo KYC data
export const demoKYC: KYCData = {
  address: '0x742d35Cc1371d8e5aa7B4f2c6B50d46e',
  name: 'John Doe',
  country: 'United States',
  taxId: '123-45-6789',
  status: 'approved',
  submittedAt: new Date('2024-01-15')
};

// Demo holdings
export const demoHoldings: Holding[] = [
  {
    assetId: '1',
    assetName: 'Kadena Tower REIT',
    symbol: 'KTREIT',
    amount: 100,
    chain: 'Chainweb EVM',
    value: 2550
  },
  {
    assetId: '2',
    assetName: 'Green Energy Fund', 
    symbol: 'GEFUND',
    amount: 50,
    chain: 'Ethereum',
    value: 637.50
  }
];

// Demo documents
export const demoDocuments: Document[] = [
  {
    cid: 'QmDemo123KadenaTowerREIT',
    name: 'Property Deed - Kadena Tower',
    hash: '0x8f434346648f6b96df89dda901c5176b10130d695aa3efc78fa80bb',
    uploadedAt: new Date('2024-01-10'),
    issuer: 'Kadena Realty Corp',
    verified: true
  },
  {
    cid: 'QmDemo456GreenEnergyCompliance',
    name: 'SEC Filing - Green Energy Fund',
    hash: '0x7e324234648f6b96df89dda901c5176b10130d695aa3efc78fa80cc',
    uploadedAt: new Date('2024-01-12'),
    issuer: 'Green Energy Holdings',
    verified: true
  }
];

// Whitelisted addresses for compliance demo
export const whitelistedAddresses = [
  '0x111111111111111111111111111111111111111111',
  '0x742d35Cc1371d8e5aa7B4f2c6B50d46e',
  '0x222222222222222222222222222222222222222222'
];

// Mock functions
export const generateTxHash = () => `0xDEMO${Math.random().toString(16).slice(2, 10)}...`;

export const mockMintAsset = async (assetData: Partial<Asset>) => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
  return {
    success: true,
    txHash: generateTxHash(),
    contractAddress: `0xDemo${Math.random().toString(16).slice(2, 8)}...`
  };
};

export const mockUploadDocument = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    success: true,
    cid: `QmDemo${Math.random().toString(16).slice(2, 10)}`,
    hash: `0x${Math.random().toString(16).slice(2, 42)}`
  };
};

export const mockKYCSubmit = async (kycData: Partial<KYCData>) => {
  await new Promise(resolve => setTimeout(resolve, 5000)); // 5s approval delay
  return {
    success: true,
    status: 'approved' as const
  };
};

export const checkWhitelisted = (address: string) => {
  return whitelistedAddresses.includes(address.toLowerCase());
};

export const mockTransfer = async (to: string, amount: number, assetId: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!checkWhitelisted(to.toLowerCase())) {
    return {
      success: false,
      error: 'Transfer Blocked by Compliance - Recipient not whitelisted'
    };
  }
  
  return {
    success: true,
    txHash: generateTxHash()
  };
};