import styles from '../styles/Home.module.css';
import { useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { MetaplexProvider } from './MetaplexProvider';
import { HolderArea } from './HolderArea';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Home() {
  const rpcHost = 'https://monketfza2mzfxcgg2gdda9dltmjn.xyz2.hyperplane.dev/';
  const [network, setNetwork] = useState(WalletAdapterNetwork.Mainnet);

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
      () => [
          new PhantomWalletAdapter(),
          new GlowWalletAdapter(),
          new SlopeWalletAdapter(),
          new SolflareWalletAdapter({ network }),
          new TorusWalletAdapter(),
      ],
      [network]
  );

  return (
    <div className='flex min-w-min min-h-screen flex-col items-center justify-center py-10 bg-monke-cream'>
      <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
        <MetaplexProvider>
          <div className='flex flex-col items-center justify-center'>
            <WalletMultiButton />
            <HolderArea />
          </div>
        </MetaplexProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </div>
  );
}

