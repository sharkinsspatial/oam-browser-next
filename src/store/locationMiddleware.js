import { LOCATION_CHANGED } from 'redux-little-router';
import { fetchItems } from '../actions/apiActions';

const locationMiddleware = store => next => (action) => {
  if (action.type !== LOCATION_CHANGED) {
    return next(action);
  } else {
    switch (action.payload.route) {
      case '/': {
        store.dispatch(fetchItems());
        break;
      }
      default: {
      }
    }
  }
  return next(action);
};

export default locationMiddleware;
