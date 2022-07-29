import React from 'react';
import { useRouter } from 'next/router';

const AuthContext = React.createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = React.useState({
    token: '',
    hw: '',
    txn: '',
  });

  const setUserAuthInfo = ({ userToken }) => {
    const token = sessionStorage.setItem('token', JSON.stringify(userToken));
    setAuthState({
      token: userToken?.token,
      hw: userToken?.hw,
      txn: userToken?.txn,
    });
  };

  // checks if the user is authenticated or not
  const isUserAuthenticated = () => {
    if (!authState.token) {
      return false;
    }
  };

  return (
    <Provider
      value={{
        authState,
        setAuthState: (userAuthInfo) => setUserAuthInfo(userAuthInfo),
        isUserAuthenticated,
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
