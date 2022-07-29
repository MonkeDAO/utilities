import React, { useState } from 'react';

import { useWallet } from '@solana/wallet-adapter-react';

import Portfolio from '../components/Portfolio';

export default function Banner() {
  const [selectedSMBNumber, setSelectedSMBNumber] = useState<number | null>(
    null
  );

  const [selectedBackground, setSelectedBackground] = useState<string | null>(
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
      <div className="w-1/2 m-auto p-4">
        <div className="grid grid-cols-2">
          <div className="">OUTPUT</div>
          <div className="">
            <h1>SELECTIONS</h1>
            <div className="grid gap-y-4">
              <div
              className="border border-blue-600 border-8 border-rounded rounded-sm"
                onClick={() =>
                  setSelectedBackground('/images/banners/monkedao_bg1.png')
                }
              >
                <img src="/images/banners/monkedao_bg1.png" />
              </div>
              <div
              className="border border-transparent border-8 border-rounded rounded-sm"
                onClick={() =>
                  setSelectedBackground('/images/banners/monkedao_bg2.png')
                }
              >
                <img src="/images/banners/monkedao_bg2.png" />
              </div>
              <div
                onClick={() =>
                  setSelectedBackground('/images/banners/banana_bg.png')
                }
              >
                <img src="/images/banners/banana_bg.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex justify-center mt-24"
        style={{ marginBottom: '150px' }}
      >
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
      <div
        className="w-full fixed bottom-0 left-0 m-auto flex justify-center"
        style={{ background: '#184623' }}
      >
        <div className="py-4 flex object-scale-down">
          {/* <img
            src={selectedBackground}
            className="object-scale-down"
            style={{ height: '100px', objectFit: 'scale-down', width: '500px' }}
          /> */}

          <span className="font-bold text-white px-5 text-xl">
            SMB #411
          </span>

          <span className="font-bold text-white px-5 text-xl">
            MonkeDAO
          </span>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10">
            Generate & Download
          </button>
        </div>
      </div>
    </>
  );
}
