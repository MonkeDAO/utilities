import { fetchJwt } from '../../middleware/fetchJwt';
import NextCors from 'nextjs-cors';
import Cors from 'cors';
import axios from 'axios';

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
  const response = await axios({
    url: 'https://xyz2.hyperplane.dev/rpcurlgen/registerMonkeURL',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ` + req.headers.authorization,
    },
    withCredentials: true,
    data: JSON.stringify({
      method: 'generateRandomUrlChecked',
      wallet_address: 'faketestwallet',
      mint_address: 'faketestmint1',
    }),
  })
  .then(response => {
    return response.data;
  }).catch(error => console.log(error));
  res.status(200).json({ url: response.url });
};

export default fetchJwt(handler);
