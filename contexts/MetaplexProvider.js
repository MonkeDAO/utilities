import { Metaplex, walletOrGuestIdentity } from '@metaplex-foundation/js';
import { MetaplexContext } from '../hooks/useMetaplex';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { useMemo } from 'react';

const MetaplexProvider = ({ children }) => {
  const wallet = useWallet();
  const metaplex = useMemo(() => {
    const connection = new Connection(
      'https://monketfza2mzfxcgg2gdda9dltmjn.xyz2.hyperplane.dev/'
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
