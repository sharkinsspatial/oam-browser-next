import { replace, LOCATION_CHANGED } from 'redux-little-router';
import { getToken } from '../utils/tokens';
import { setHasValidToken } from '../actions/authActions';
import { restrictedRoutes } from '../constants/routes';

export default store => next => (action) => {
  if (action.type === LOCATION_CHANGED
     && restrictedRoutes.includes(action.payload.route)) {
    const token = getToken();
    if (!token) {
      store.dispatch(setHasValidToken(false));
      store.dispatch(replace({ pathname: '/' }));
    } else {
      next(action);
    }
  } else {
    next(action);
  }
};
