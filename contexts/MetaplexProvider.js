import { Metaplex, walletOrGuestIdentity } from '@metaplex-foundation/js';
import { MetaplexContext } from '../hooks/useMetaplex';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { useMemo } from 'react';

const MetaplexProvider = ({ children }) => {
  const wallet = useWallet();
  const metaplex = useMemo(() => {
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_HOST ?? "https://metaplex-studio.rpcpool.com/"
    );
    return Metaplex.make(connection).use(
      walletOrGuestIdentity(wallet.connected ? wallet : null)
    );
  }, [wallet]);

  return (
    <MetaplexContext.Provider value={{ metaplex }}>
      {children}
    </MetaplexContext.Provider>
  );
};

export default MetaplexProvider;
