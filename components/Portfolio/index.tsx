/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';

import { Nft } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import styles from '../../styles/Home.module.css';
import { useMetaplex } from '../../pages/useMetaplex';

const SMB_VERIFIED_CREATOR = new PublicKey(
  '9uBX3ASjxWvNBAD1xjbVaKA74mWGZys3RGSF7DdeDD3F'
);

import toast from 'react-hot-toast';

const Portfolio = ({
  onSelectionChange = () => {},
}: {
  onSelectionChange?: (smbNumber: number) => void;
}) => {
  const { metaplex } = useMetaplex();
  const wallet = useWallet();
  const [hasMultipleSmbs, setHasMultipleSmbs] = useState(false);
  const [nft, setNft] = useState<Nft | null>(null);
  const [smbs, setSmbs] = useState<Array<any>>([]);

  const onClick = async () => {
    let randIdx = Math.floor(Math.random() * smbs.length);
    await smbs[randIdx].metadataTask.run();
    setNft(smbs[randIdx]);
    onSelectionChange(Number(smbs[randIdx].name.replace('SMB #', '')));
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
        onSelectionChange(Number(smbs[randIdx].name.replace('SMB #', '')));

        if (smbs.length > 1) {
          setHasMultipleSmbs(true);
        }
      }
    };

    fetchNfts().catch(console.error);
  }, [wallet, metaplex]);

  return (
    <div className={styles.container}>
      {nft && (
        <div className="flex justify-center items-center">
          {hasMultipleSmbs && (
            <button onClick={onClick} className="hover:text-monke-light-green">
              Prev
            </button>
          )}
          <div className="">
            <div className={styles.nftPreview}>
              <h1>{nft.name}</h1>
              <img
                src={nft.metadata.image}
                alt="The downloaded illustration of the solana monke business NFT."
              />
            </div>
            <div className="mt-10">
              <h1 className="text-lg">SMB Mint Address</h1>
              <a
                onClick={() => {
                  navigator.clipboard.writeText(nft.mint.toBase58());
                  toast.success('Copied Address to Clipboard', {
                    style: {
                      background: '#184623',
                      color: '#f3efcd',
                    },
                    position: 'top-center',
                  });
                }}
                className="transition duration-1200 ease-in cursor-pointer text-green hover:text-monke-light-green"
              >
                {nft ? nft.mint.toBase58() : ''}
              </a>
            </div>
          </div>
          {hasMultipleSmbs && (
            <button onClick={onClick} className="hover:text-monke-light-green">
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
