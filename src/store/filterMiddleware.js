import { fetchFilteredItems } from '../actions/apiActions';
import { FILTER_ITEMS } from '../constants/action_types';

const filterMiddleware = store => next => (action) => {
  if (action.type === FILTER_ITEMS) {
    store.dispatch(fetchFilteredItems(action.payload.featureIds));
  }
  return next(action);
};

export default filterMiddleware;
