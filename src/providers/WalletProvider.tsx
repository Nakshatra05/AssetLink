'use client';

import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { chainwebEVMTestnet } from '@/lib/chains';

import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'AssetLink',
  projectId: 'demo-project-id',
  chains: [chainwebEVMTestnet],
  ssr: false,
});

const queryClient = new QueryClient();

const customTheme = darkTheme({
  accentColor: 'hsl(50, 100%, 60%)',
  accentColorForeground: 'hsl(222, 47%, 4%)',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}