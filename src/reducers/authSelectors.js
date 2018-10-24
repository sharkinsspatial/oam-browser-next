import { createSelector } from 'reselect';

const getHasValidTokenState = state => state.auth.get('hasValidToken');

export const getHasValidToken = createSelector(
  [getHasValidTokenState],
  hasValidToken => hasValidToken
);
