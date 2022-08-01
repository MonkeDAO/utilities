export function getToken() {
  try {
    const tokenString = typeof window === 'undefined' ? '{}' : sessionStorage.getItem('token') || '{}';
    const userToken = tokenString && JSON.parse(tokenString);
    return { token: userToken?.token, hw: userToken?.hw, txn: userToken?.txn };
  } catch (e) {
    return { token: undefined, hw: undefined, txn: undefined };
  }
}

export function clearToken() {
  const tokenString = sessionStorage.getItem('token') || '{}';
  const userToken = JSON.parse(tokenString);
  if (userToken) {
    sessionStorage.removeItem('token');
  }
}
