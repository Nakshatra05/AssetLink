import { defineChain } from 'viem';

export const chainwebEVMTestnet = defineChain({
  id: 5920,
  name: 'Chainweb EVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'KDA',
    symbol: 'KDA',
  },
  rpcUrls: {
    default: {
      http: ['https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Chainweb EVM Explorer',
      url: 'http://chain-20.evm-testnet-blockscout.chainweb.com/',
    },
  },
  testnet: true,
});