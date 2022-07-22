import NextCors from 'nextjs-cors';

export const fetchJwt = (handler) => {
  // Run the cors middleware
  // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
  return async (req, res) => {
    await NextCors(req, res, {
      // Options
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    const details = {
      username: 'monke-sa',
      password: 'sfQ3ofNPqFitPnHG9QHUT9jT',
      client_id: 'istio',
      grant_type: 'password',
    };

    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + '=' + encodeURIComponent(details[key])
      )
      .join('&');

    const rawJwtResponse = await fetch('https://xyz2.hyperplane.dev/auth/realms/Hyperplane/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    });
    const response = await rawJwtResponse.json();
    req.headers.Authorization = `Bearer ${response.access_token}`;
    return handler(req, res);
  };
};
