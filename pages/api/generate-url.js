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
    url: 'https://xyz2.hyperplane.dev/rpcurlgen/generateRandomUrl',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ` + req.headers.authorization,
    },
    withCredentials: true,
    data: JSON.stringify({
      client: 'monke',
      wallet_address: wallet,
    }),
  })
  .then(response => {
    res.status(200).json({ url: response.data.url });
    return response.data;
  }).catch(error => {
    console.log(error, 'shakudo failing')
    res.status(500).json({ error: error });
  });
};

export default fetchJwt(handler);
