import { LOCATION_CHANGED } from 'redux-little-router';
import {
  SET_STYLE_SUCCEEDED,
  FETCH_FILTERED_ITEMS,
  FETCH_FILTERED_ITEMS_SUCCEEDED,
  FETCH_FILTERED_ITEMS_FAILED
} from '../constants/action_types';
import {
  filterItem,
  setActiveImageItem,
  turnOffPointLayers
} from '../actions/stylesheetActionCreators';
import fetchWrapper from '../utils/fetchWrapper';
import { getStyle } from '../reducers/stylesheetSelectors';

const locationMiddleware = store => next => async (action) => {
  if (action.type === SET_STYLE_SUCCEEDED) {
    const { router } = store.getState();
    const { route, params } = router;
    if (route === '/imageitems/:imageId') {
      const imageId = parseInt(params.imageId, 10);
      store.dispatch({ type: FETCH_FILTERED_ITEMS });

      const responseJSON = await fetchWrapper(
        'filteredItems', 'POST', null, [imageId]
      ).catch(error => (
        next({
          error: error.message || 'There was an error.',
          type: FETCH_FILTERED_ITEMS_FAILED
        })
      ));
      store.dispatch(filterItem({
        clusterIds: [],
        featureIds: [imageId]
      }));
      store.dispatch({
        payload: {
          json: responseJSON,
          authenticated: false
        },
        type: FETCH_FILTERED_ITEMS_SUCCEEDED
      });
      store.dispatch(turnOffPointLayers());
      store.dispatch(setActiveImageItem(imageId));
    } else {
      next(action);
    }
  } else if (action.type === LOCATION_CHANGED) {
    const { route, params } = action.payload;
    if (route === '/imageitems/:imageId') {
      const style = getStyle(store.getState());
      if (style.size > 0) {
        const imageId = parseInt(params.imageId, 10);
        store.dispatch(turnOffPointLayers());
        store.dispatch(setActiveImageItem(imageId));
      } else {
        next(action);
      }
    }
  } else {
    next(action);
  }
};
export default locationMiddleware;
