/* global fetch */
import { getToken } from '../utils/tokens';
import { setHasValidToken } from '../actions/authActions';
import { CALL_API } from '../constants/action_types';

const BASE_URL = process.env.REACT_APP_API_URL;

function callApi(endpoint, method, token, json) {
  const config = {
    method,
    Accept: 'application/json',
    headers: { 'content-type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify(json)
  };

  if (token) {
    config.headers = { Authorization: token };
  }

  return fetch(BASE_URL + endpoint, config)
    .then(response => response.text()
      .then(text => ({ text, response })))
    .then(({ text, response }) => {
      if (!response.ok) {
        const error = new Error(response.statusText);
        return Promise.reject(error);
      }
      return text;
    })
    .catch(err => Promise.reject(err.message));
}

const apiMiddleware = store => next => (action) => {
  if (action.type !== CALL_API) {
    return next(action);
  }
  const {
    endpoint,
    types,
    authenticated,
    method,
    json
  } = action.payload;

  const { requestType, successType, errorType } = types;

  const handleResponse = (response) => {
    const responseJSON = JSON.parse(response);
    return next({
      payload: {
        json: responseJSON,
        authenticated,
      },
      type: successType
    });
  };

  const handleErrorResponse = error => next({
    error: error.message || 'There was an error.',
    type: errorType
  });

  store.dispatch({ type: requestType });
  let call;
  if (authenticated) {
    const token = getToken();
    if (!token) {
      store.dispatch(setHasValidToken(false));
    } else {
      call = callApi(endpoint, method, token, json)
        .then(handleResponse)
        .catch(handleErrorResponse);
    }
  } else {
    call = callApi(endpoint, method, null, json)
      .then(handleResponse)
      .catch(handleErrorResponse);
  }
  return call;
};
export default apiMiddleware;
