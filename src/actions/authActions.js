import { TOKEN_EXPIRED } from '../constants/action_types';

export function tokenExpired() {
  return {
    type: TOKEN_EXPIRED
  };
};
