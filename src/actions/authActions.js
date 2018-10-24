import { SET_HAS_VALID_TOKEN } from '../constants/action_types';

export function setHasValidToken(hasValidToken) {
  return {
    type: SET_HAS_VALID_TOKEN,
    payload: {
      hasValidToken
    }
  };
}
