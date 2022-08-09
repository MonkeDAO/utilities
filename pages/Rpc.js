import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { getToken } from '../utils/tokenUtils';
import Link from 'next/link';

export default function Rpc() {
  const wallet = useWallet();
  const router = useRouter();
  const tokenObj = getToken();

  const [currentUrl, setCurrentUrl] = useState('');
  const generateUrl = async (mint) => {
    // const pub = publicKey?.toBase58();
    const response = await axios({
      url: `/api/generate-url?wallet=${wallet.publicKey.toBase58()}`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setCurrentUrl(`${response.data.url}`);
        return response.data;
      })
      .catch((error) => {
        toast.error('Shakkudo failed to generate rpc url', {
          style: {
            background: '#184623',
            color: '#f3efcd',
          },
          position: 'top-center',
        });
      });
  };
  useEffect(() => {
    if (!wallet.connected || !tokenObj.token) {
      router.push('/Login');
    }
  });
  return (
    <div className="bg-monke-cream min-w-min min-h-screen">
      <div className="flex justify-between container mx-auto mb-10">
        <div className="w-full">
          <div className="mt-4 px-4">
            <h1 className="text-3xl font-semibold py-7 px-5"><Link href="/">MonkeDAO</Link></h1>
            <h1 className="font-thinner flex text-4xl pt-10 px-5">
              Generate RPC Urls
            </h1>

            <div className="mx-5 my-5">
              <label
                className="relative block p-3 border-2 border-black rounded"
                htmlFor="url"
              >
                <span
                  className="text-md font-semibold text-zinc-900"
                  htmlFor="url"
                >
                  URL
                </span>
                <input
                  className="w-full bg-transparent p-0 text-lg text-gray-500 focus:outline-none"
                  id="url"
                  type="text"
                  placeholder="http://"
                  value={currentUrl}
                />
                <button
                  className="mt-5 bg-transparent hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                  onClick={generateUrl}
                >
                  Generate
                </button>
              </label>

              <div className="block p-3 border-2 mt-5 border-black rounded">
                <p className="text-2xl font-semibold text-zinc-900 mb-5">
                  Your urls
                </p>
                <a
                  onClick={() => {
                    navigator.clipboard.writeText(`wss://${currentUrl}/`);
                    toast.success('Copied wss url to clipboard', {
                      style: {
                        background: '#184623',
                        color: '#f3efcd',
                      },
                      position: 'top-center',
                    });
                  }}
                >
                  <div className="my-2 flex h-16 items-center justify-between rounded-lg border-2 border-b-4 border-l-4 border-black px-4 shadow-xl">
                    <div className="flex items-center">
                      <p className="text-xl text-gray-500">
                        wss://{currentUrl}/
                      </p>
                    </div>
                  </div>
                </a>
                <a
                  onClick={() => {
                    navigator.clipboard.writeText(`https://${currentUrl}/`);
                    toast.success('Copied https url to clipboard', {
                      style: {
                        background: '#184623',
                        color: '#f3efcd',
                      },
                      position: 'top-center',
                    });
                  }}
                >
                  <div className="my-2 flex h-16 items-center justify-between rounded-lg border-2 border-b-4 border-l-4 border-black px-4 shadow-xl">
                    <div className="flex items-center">
                      <p className="text-xl text-gray-500">
                        https://{currentUrl}/
                      </p>
                    </div>
                  </div>
                </a>
              </div>

              <h1 className="text-2xl font-semibold mt-10 mb-12">
                What are you using your urls for:
              </h1>
              <p className="text-black text-xl font-normal flex gap gap-2 pt-2">
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                  Minting
                </button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                  Infrastructure
                </button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                  App/NFT project
                </button>
              </p>

              <p className="text-black text-xl font-normal flex gap gap-2 pt-2">
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                  Testing
                </button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                  Other
                </button>
              </p>

              <button className="mt-5 mb-5 border-2 px-5 py-2 rounded-lg border-black border-b-4 font-black text-2xl translate-y-2 border-l-4">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="text-5xl justify-center text-center font-semibold text-zinc-900 my-12">
        Why a custom RPC?
      </p>

      <div className="flex items-center justify-center p-5">
        <div className="grid max-w-screen-xl gap-4 lg:grid-cols-2 lg:grid-rows-2">
          <div className="row-span-2 flex flex-col rounded-md border border-slate-200">
            <div className="h-1/2 flex-1">
              <Image
                src="/rpc_images/rpc-fast-connection.png"
                alt="fast connections"
                width="350"
                height="350"
              />
            </div>
            <div className="p-10">
              <h3 className="text-3xl font-medium text-gray-700">
                Quick connections
              </h3>
              <p className="mt-2 text-xl text-slate-600">
                Solana is inherently slow because requests to mainnet get rate
                limited. Using a custom rpc ensures that you get priority and
                can always get connected.
              </p>
              <a
                href="https://docs.hyperplane.dev/home"
                className="mt-2 inline-flex text-monke-light-green"
              >
                Read More →
              </a>
            </div>
          </div>
          <div className="flex rounded-md border border-slate-200">
            <div className="flex-1 p-10">
              <h3 className="text-3xl font-medium text-gray-700">
                High performance
              </h3>
              <p className="mt-2 text-xl text-slate-600">
                Mint quickly and have transactions confirm faster than when
                using a general node. Custom rpcs give users the confidence in
                the reliability of transactions they are putting on the chain.
              </p>
              {/* <a href="" className="mt-2 inline-flex text-monke-light-green">
                Read More →
              </a> */}
            </div>

            <div className="relative hidden h-full w-1/3 overflow-hidden lg:block">
              <div className="absolute inset-0">
                <Image
                  src="/rpc_images/performance.png"
                  alt="fast connections"
                  width="350"
                  height="350"
                  className="h-full w-full object-cover object-left-top"
                />
              </div>
            </div>
          </div>
          <div className="flex rounded-md border border-slate-200">
            <div className="flex-1 p-10">
              <h3 className="text-3xl font-medium text-gray-700">
                Constant availability
              </h3>
              <p className="mt-2 text-xl text-slate-600">
                Shakkudo rpcs have a higher availability than general nodes.
                They are always online and scale easily thus empowering the
                monke users.
              </p>
              {/* <a href="" className="mt-2 inline-flex text-monke-light-green">
                Read More →
              </a> */}
            </div>

            <div className="relative hidden h-full w-1/3 overflow-hidden lg:block">
              <div className="absolute inset-0">
                <Image
                  src="/rpc_images/constant-available.png"
                  alt="fast connections"
                  width="350"
                  height="350"
                  className="h-full w-full object-cover object-left-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
