import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';
import Portfolio from '../components/Portfolio';

export default function Banner() {
  const [selectedSMBNumber, setSelectedSMBNumber] = useState<number | null>(
    null
  );
  const [isDownloadError, setIsDownloadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [whichTab, setWhichTab] = useState(0);
  const banners = ['black_monke', 'waves_bg', 'banana_bg'];
  const lockScreens = ['ip12-blue', 'ip12-green', 'ip12-orange', 'ip12-purple', 'ip12-pink', 'ip12-yellow'];
  const wallet = useWallet();
  const tabActiveClasses = 'text-monke-green border-monke-light-green active';
  const tabInactiveClasses =
    'border-transparent hover:text-gray-600 hover:border-gray-300';
  useEffect(() => {
    if (isLoading) {
      toast.loading('Downloading Monke Art', {
        style: {
          background: '#184623',
          color: '#f3efcd',
        },
        duration: 2000,
        position: 'top-center',
      });
    }
    return () => {}
  }, [isLoading]);
  const onClickDownload = async (image: string) => {
    setIsLoading(true);
    console.log(image, 'clicked');
    setIsDownloadError(false);
    try {
      const result = await fetch('/api/banner/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedSMBNumber,
          image,
        }),
      });

      if (!result || result.status !== 200) {
        throw new Error('Generate & Download Failed');
      }
      const blob = await result.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'monkedao_banner.png');
      document.body.appendChild(link);
      link.click();
      link?.parentNode?.removeChild(link);
    } catch (e) {
      toast.error('Issue generating banner', {
        position: 'top-center',
      });
      setIsDownloadError(true);
    }
    finally {
      setIsLoading(false);
    }
  };
  const liClicked = (which: number) => {
    setWhichTab(which);
  };

  const Headers = banners.map((banner, index) => {
    return (
      <div className="w-full rounded hover:opacity-50" key={index} onClick={() => onClickDownload(banner)}>
        <Image
          src={`/banners/${banner}.png`}
          alt="twitter header"
          width={500}
          height={150}
        />
      </div>
    );
  });

  const LockScreens = lockScreens.map((screen, index) => {
    return (
      <div className="w-full rounded hover:opacity-50" key={index} onClick={() => onClickDownload(screen)}>
        <Image
          src={`/mobile/${screen}.png`}
          alt="lock screen"
          height={300}
          width={150}
        />
      </div>
    );
  });

  if (!wallet.connected) {
    return null;
  }
  return (
    <>
      <div className="flex min-w-min min-h-screen flex-col items-center justify-center py-10 bg-monke-cream">
        <div className="flex flex-col items-center justify-center">
          <Portfolio
            onSelectionChange={(selectedSMBNumber: number) =>
              setSelectedSMBNumber(selectedSMBNumber)
            }
          />
          <div className="flex flex-col text-xl items-center justify-center">
            <p>Download a lock screen/twitter banner with your SMB on it</p>
          </div>
          <div className="mb-12 border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
              <li className="mr-2" key={0} onClick={() => liClicked(0)}>
                <a
                  href="#"
                  className={`${
                    whichTab == 0 ? tabActiveClasses : tabInactiveClasses
                  } inline-flex p-4 rounded-t-lg border-b-2 group text-2xl`}
                >
                  <div className="mr-1">
                    <Image
                      src="/icons/MonkeDAO_Icons_Working-61.svg"
                      height={20}
                      width={20}
                      alt="lock icon"
                    />
                  </div>
                  Lock Screen
                </a>
              </li>
              <li className="mr-2" key={1} onClick={() => liClicked(1)}>
                <a
                  href="#"
                  className={`${
                    whichTab == 1 ? tabActiveClasses : tabInactiveClasses
                  } inline-flex p-4 rounded-t-lg border-b-2 group text-2xl`}
                  aria-current="page"
                >
                  <div className="mr-1">
                    <Image
                      src="/icons/MonkeDAO_Icons_Working-55.svg"
                      height={20}
                      width={20}
                      alt="thumbs up icon"
                    />
                  </div>
                  Twitter Headers
                </a>
              </li>
            </ul>
          </div>
          <div className="container mx-auto space-y-2 lg:space-y-0 lg:gap-2 lg:grid lg:grid-cols-3">
            {whichTab == 0 ? LockScreens : Headers}
          </div>
        </div>
      </div>
    </>
  );
}
