/* global window localStorage */
import jwt from 'jsonwebtoken';

const key = 'admin_token';

const tokenIsVaild = (token) => {
  const currentTime = new Date().getTime() / 1000;
  if (token && token !== 'undefined') {
    const decoded = jwt.decode(token);
    const isValid = decoded.exp > currentTime;
    return isValid;
  }
  return false;
};

export const getToken = () => {
  let token;
  const storedToken = localStorage.getItem(key);
  if (tokenIsVaild(storedToken)) {
    token = storedToken;
  }
  return token;
};

export const setToken = (token) => {
  localStorage.setItem(key, token);
};

export const clearToken = () => {
  localStorage.removeItem(key);
};
