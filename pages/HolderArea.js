import Link from 'next/link';

import { useWallet } from '@solana/wallet-adapter-react';
import { getToken } from '../utils/tokenUtils';
import Portfolio from '../components/Portfolio';

export const HolderArea = (props) => {
  const wallet = useWallet();
  const tokenObj = getToken();

  if (!wallet.connected || !tokenObj.token) {
    return null;
  }

  return (
    <div>
      <Portfolio />

      <h1 className="text-center text-2xl sm:text-5xl py-10 font-medium">
        Holder Section
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 text-center mx-6 sm:mx-48 gap-x-5 gap-y-5 my-10">
        <div className="border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
          <button onClick={() => window.location.replace("https://www.monkemaps.com/")}>MonkeMaps</button>
        </div>

        <div className="border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
          <Link href="/Rpc">Custom RPC</Link>
        </div>
        <div className="grayscale border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
          QR Code Generator
        </div>
        <div className="border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
          <Link href="/Banner">Banner Maker</Link>
        </div>
        <div className="grayscale border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
          Monke Rewards
        </div>
        <div className="grayscale border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
          Monke Referrals
        </div>
      </div>
    </div>
  );
};
