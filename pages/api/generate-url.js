import { fetchJwt } from '../../middleware/fetchJwt';
import NextCors from 'nextjs-cors';
import Cors from 'cors';

// get jwt from middle ware
// call shakkudos to get url
// call endpoint in monkebackend to store details

const handler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const smbMint = req.query.mint;
  const wallet = req.query.wallet;
  const rawResponse = await fetch(
    'https://xyz2.hyperplane.dev/rpcurlgen/registerMonkeURL',
    {
      method: 'POST',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${req.headers.authorization}`,
      },
      body: JSON.stringify({
        method: 'generateRandomUrlChecked',
        wallet_address: 'faketestwallet',
        mint_address: 'faketestmint1',
      }),
    }
  );
  const response = await rawResponse.json();
    console.log(rawResponse.status, rawResponse.headers);
    // const rawResponse2 = await fetch(
    //     'https://xyz2.hyperplane.dev/rpcurlgen/registerMonkeURL',
    //     {
    //       method: 'POST',
    //       redirect: 'follow',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${req.headers.authorization}`,

    //       },
    //       body: JSON.stringify({
    //         method: 'generateRandomUrlChecked',
    //         wallet_address: 'faketestwallet',
    //         mint_address: 'faketestmint1',
    //       }),
    //     }
    //   );
  res.status(200).json({ result: true });
};

export default fetchJwt(handler);
