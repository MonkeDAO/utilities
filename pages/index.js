import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

import { HolderArea } from './HolderArea';
import Login from './Login';
import useToken from '../hooks/useToken';

export default function Home() {
  const { token, setToken } = useToken();
  return (
    <>
      {!token?.token ? (
        <Login />
      ) : (
        <div className="flex min-w-min min-h-screen flex-col items-center justify-center py-10 bg-monke-cream">
          <div className="flex flex-col items-center justify-center">
            <HolderArea />
          </div>
        </div>
      )}
    </>
  );
}
