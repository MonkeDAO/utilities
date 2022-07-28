

import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = typeof window === "undefined" ? '{}' : sessionStorage.getItem('token');
    const userToken = tokenString && JSON.parse(tokenString);
    return { token: userToken?.token, hw: userToken?.hw, txn: userToken?.txn };
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: any) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken({
      token: userToken?.token,
      hw: userToken?.hw,
      txn: userToken?.txn,
    });
  };

  return {
    setToken: saveToken,
    token,
  };
}