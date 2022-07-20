/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';

import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import styles from '../../styles/Home.module.css';
import { useMetaplex } from '../../pages/useMetaplex';

const SMB_VERIFIED_CREATOR = new PublicKey(
  '9uBX3ASjxWvNBAD1xjbVaKA74mWGZys3RGSF7DdeDD3F'
);

import toast from 'react-hot-toast';

const Portfolio = () => {
  const { metaplex } = useMetaplex();
  const wallet = useWallet();
  const [hasMultipleSmbs, setHasMultipleSmbs] = useState(false);
  const [nft, setNft] = useState(null);
  const [smbs, setSmbs] = useState<Array<any>>([]);

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
          .findAllByOwner(metaplex?.identity().publicKey);
        if (!myNfts.length) {
          setNft(null);
          return;
        }
        let smbs = myNfts.filter(
          (nft: any) => nft.updateAuthority.toBase58() == SMB_VERIFIED_CREATOR
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
  );
};

export default Portfolio;