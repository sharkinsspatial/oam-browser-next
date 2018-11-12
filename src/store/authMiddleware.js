import { replace, LOCATION_CHANGED } from 'redux-little-router';
import { getHasValidToken } from '../reducers/authSelectors';

export default store => next => (action) => {
  if (action.type === LOCATION_CHANGED) {
    const restrictedRoutes = ['/uploads'];
    if (restrictedRoutes.includes(action.payload.route)) {
      const hasValidToken = getHasValidToken(store.getState());
      if (hasValidToken) {
        next(action);
      } else {
        store.dispatch(replace({ pathname: '/' }));
      }
    } else {
      next(action);
    }
  } else {
    next(action);
  }
};
