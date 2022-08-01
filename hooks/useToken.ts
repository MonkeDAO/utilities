import { useEffect, useState } from 'react';

type Token = { token?: string; hw?: string; txn?: string };

export default function useToken() {
  const getToken = () => {
    try {
      const tokenString =
        typeof window === 'undefined' ? '{}' : sessionStorage.getItem('token');
      const userToken = tokenString && JSON.parse(tokenString);
      return {
        token: userToken?.token,
        hw: userToken?.hw,
        txn: userToken?.txn,
      };
    } catch (e) {
      return { token: undefined, hw: undefined, txn: undefined };
    }
  };

  const [token, setToken] = useState<Token>();
  useEffect(() => {
    setToken(getToken());
  }, []);

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
