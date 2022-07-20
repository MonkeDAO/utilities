/* eslint-disable @next/next/no-img-element */
import styles from '../styles/Home.module.css';
import { useMetaplex } from './useMetaplex';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Link from 'next/link';

const SMB_VERIFIED_CREATOR = new PublicKey(
  '9uBX3ASjxWvNBAD1xjbVaKA74mWGZys3RGSF7DdeDD3F'
);

import toast from 'react-hot-toast';

export const HolderArea = (props) => {
  const { metaplex } = useMetaplex();
  const wallet = useWallet();
  const [hasMultipleSmbs, setHasMultipleSmbs] = useState(false);
  const [nft, setNft] = useState(null);
  const [smbs, setSmbs] = useState(null);
  const onClick = async () => {
    let randIdx = Math.floor(Math.random() * smbs.length);
    await smbs[randIdx].metadataTask.run();
    setNft(smbs[randIdx]);
  };
  useEffect(() => {
    const fetchNfts = async () => {
      if (metaplex) {
        let myNfts = await metaplex
          .nfts()
          .findAllByOwner(metaplex.identity().publicKey);
        if (!myNfts.length) {
          setNft(null);
          return;
        }
        let smbs = myNfts.filter(
          (nft) => nft.updateAuthority.toBase58() == SMB_VERIFIED_CREATOR
        );
        let randIdx = Math.floor(Math.random() * smbs.length);
        await smbs[randIdx].metadataTask.run();
        setSmbs(smbs);
        setNft(smbs[randIdx]);
        if (smbs.length > 1) {
          setHasMultipleSmbs(true);
        }
      }
    };

    fetchNfts().catch(console.error);
  }, [wallet, metaplex]);

  return (
    wallet.connected && (
      <div>
        <div>
          <div className={styles.container}>
            <h1 className={styles.title}>SMB Mint Address</h1>
            <div className={styles.nftForm}>
              {hasMultipleSmbs && <button onClick={onClick}>Prev</button>}
              <a
                onClick={() => {
                  navigator.clipboard.writeText(nft.mint.toBase58());
                  toast.success('Copied Address to Clipboard');
                }}
                className="transition duration-1200 ease-in cursor-pointer text-green hover:text-monke-light-green"
              >
                {nft ? nft.mint.toBase58() : ''}
              </a>
              {hasMultipleSmbs && <button onClick={onClick}>Next</button>}
            </div>
            {nft && (
              <div className={styles.nftPreview}>
                <h1>{nft.name}</h1>
                <img
                  src={nft.metadata.image}
                  alt="The downloaded illustration of the solana monke business NFT."
                />
              </div>
            )}
          </div>
        </div>
        <h1 className="text-center text-2xl sm:text-5xl py-10 font-medium">
          Holder Section
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 text-center mx-6 sm:mx-48 gap-x-5 gap-y-5 my-10">
          <div className="border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
            MonkeMaps
          </div>

          <div className="border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
            <Link href="/Rpc">Custom RPC</Link>
          </div>
          <div className="grayscale border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
            QR Code Generator
          </div>
          <div className="grayscale border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
            Banner Maker
          </div>
          <div className="grayscale border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
            Monke Rewards
          </div>
          <div className="grayscale border-2 shadow-lg rounded-lg p-20 font-bold text-2xl bg-monke-green text-monke-cream">
            Monke Referrals
          </div>
        </div>
      </div>
    )
  );
};
