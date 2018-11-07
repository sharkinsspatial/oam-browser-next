/* global localStorage */
import jwt from 'jsonwebtoken';

const key = process.env.REACT_APP_ACCESS_TOKEN_KEY;

const tokenIsVaild = (token) => {
  const currentTime = new Date().getTime() / 1000;
  if (token && token !== 'undefined') {
    const decoded = jwt.decode(token);
    const isValid = decoded.exp > currentTime;
    return isValid;
  }
  return false;
};

export const getTokenUserId = (token) => {
  const decoded = jwt.decode(token);
  return decoded.id;
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
