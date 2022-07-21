import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { HolderArea } from './HolderArea';

import '@solana/wallet-adapter-react-ui/styles.css';

export default function Home() {
  return (
    <div className="flex min-w-min min-h-screen flex-col items-center justify-center py-10 bg-monke-cream">
      <div className="flex flex-col items-center justify-center">
        <WalletMultiButton />
        <HolderArea />
      </div>
    </div>
  );
}
