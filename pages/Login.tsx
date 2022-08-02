import { useCallback, useState, useEffect } from 'react';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import toast from 'react-hot-toast';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { CONSTANTS } from '../utils/constants';
import { useRouter } from 'next/router';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import useToken from '../hooks/useToken';

const bs58 = require('bs58');

export default function Login() {
  const router = useRouter();
  const { token, setToken } = useToken();
  const { publicKey, connected, connect, signMessage, signTransaction } =
    useWallet();

  const { connection } = useConnection();
  const [isHardwareWallet, setIsHardwareWallet] = useState(false);
  const walletId = publicKey?.toBase58() ?? '';
  const verify = useCallback(async () => {
    if (!connected) {
      await connect();
    }
    try {
      toast('Logging you in...', {
        position: 'top-center',
      });
      const message = `Sign this message for authenticating with your wallet. Nonce: ${walletId}`;
      const conn = connection as Connection;
      if (isHardwareWallet) {
        if (!signTransaction) {
          toast.error('Wallet does not support signing transactions.', {
            position: 'top-center',
          });
          return Promise.reject();
        }
        //hardcode for now
        const response = await fetch(`${CONSTANTS.API_URL}/auth/txn`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletId, message: btoa(message) }),
        });

        const res = await response.json();
        if (res?.token) {
          const latestBlockHash = await conn.getLatestBlockhash();
          const walletPk = new PublicKey(walletId);
          const transaction = new Transaction();
          transaction.feePayer = walletPk;
          transaction.recentBlockhash = latestBlockHash.blockhash;
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: walletPk,
              toPubkey: new PublicKey(res.destination),
              lamports: res.lamports,
            })
          );
          const signedTxn = await signTransaction(transaction);
          const txnSerialized = signedTxn.serialize();
          const signature = await conn.sendRawTransaction(txnSerialized, {
            skipPreflight: true,
          });
          await conn.confirmTransaction(
            {
              blockhash: latestBlockHash.blockhash,
              lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
              signature,
            },
            'confirmed'
          );
          setToken({ token: res, hw: 'true', txn: signature });
          toast.success('Success! Redirecting...', {
            position: 'top-center',
          });
          window.location.reload();
        } else {
          toast.error(
            `Unsuccessful. Make sure you own a monke. ${res?.msg ?? ''}`,
            {
              position: 'top-center',
            }
          );
        }
      } else {
        const encodedMessage = new TextEncoder().encode(message);
        if (!walletId) throw new Error('Wallet not connected!');
        if (!signMessage)
          throw new Error('Wallet does not support message signing!');
        const signedMessage = await signMessage(encodedMessage);
        const signedAndEncodedMessage = bs58.encode(signedMessage);
        const response = await fetch(`${CONSTANTS.API_URL}/auth/sign`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletId,
            message: btoa(message),
            signedMsg: signedAndEncodedMessage,
          }),
        });
        const tkn = await response.json();
        setToken({ token: tkn.token, hw: '' });
        if (tkn.token) {
          toast.success('Success! Redirecting...', {
            position: 'top-center',
          });
          window.location.reload();
        } else {
          toast.error(
            `Unsuccessful. Make sure you own a monke. ${tkn?.msg ?? ''}`,
            {
              position: 'top-center',
            }
          );
        }
      }
    } catch (err: any) {
      console.log('ERROR >>>', err, err?.message);
      toast.error('Failed to login.', {
        position: 'top-center',
      });
      return Promise.reject(err);
    }
  }, [setToken, publicKey, isHardwareWallet]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-monke-cream">
      <div className="p-12 mt-4 text-left bg-monke-green shadow-lg rounded-md">
        <h3 className="text-3xl font-bold text-center text-monke-cream">
          Authenticate your Monke Wallet
        </h3>
        <div className="my-12 flex items-center justify-center">
          <WalletMultiButton />
        </div>
        <div>
          <input
            id="default-checkbox"
            checked={isHardwareWallet}
            onChange={(e: any) => setIsHardwareWallet(e.target.checked)}
            type="checkbox"
            value=""
            className="mt-8 w-5 h-5 text-green-600 bg-gray-100 rounded-md border-green-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="ml-2 text-3xl font-medium text-center text-monke-cream">
            Using a hardware wallet?
          </label>
        </div>
        <div className="my-12 flex items-center justify-center">
          <button
            className="border-2 border-black rounded-md border-b-4 border-l-4 text-center font-black text-2xl p-5 bg-monke-light-green mt-8 disabled:opacity-25"
            onClick={verify}
            disabled={!connected && !publicKey}
          >
            Authenticate
          </button>
        </div>
      </div>
    </div>
  );
}
