import React, { useState } from 'react';

import { useWallet } from '@solana/wallet-adapter-react';

import Portfolio from '../../components/Portfolio';

export default function Banner() {
  const [selectedSMBNumber, setSelectedSMBNumber] = useState<number | null>(
    null
  );

  const wallet = useWallet();
  if (!wallet.connected) {
    return null;
  }
  return (
    <>
      <Portfolio
        onSelectionChange={(selectedSMBNumber: number) =>
          setSelectedSMBNumber(selectedSMBNumber)
        }
      />
      <div className="flex justify-center mt-24">
        <button
          onClick={async () => {
            const result = await fetch('/api/banner/build', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                selectedSMBNumber,
              }),
            });

            const blob = await result.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'monkedao_banner.png');
            document.body.appendChild(link);
            link.click();
            link?.parentNode?.removeChild(link);
          }}
        >
          Download
        </button>
      </div>
    </>
  );
}
