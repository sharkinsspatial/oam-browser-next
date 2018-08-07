import { LOCATION_CHANGED } from 'redux-little-router';
import { fetchItems } from '../actions/apiActions';
//import { setActiveImageItem } from '../actions/stylesheetActionCreators';

const locationMiddleware = store => next => (action) => {
  if (action.type === LOCATION_CHANGED) {
    switch (action.payload.route) {
      case '/': {
        store.dispatch(fetchItems());
        break;
      }
      //case '/imageitems/:imageId': {
        //const { params } = action.payload;
        //store.dispatch(setActiveImageItem(params));
        //break;
      //}
      default: {
      }
    }
  }
  return next(action);
};

export default locationMiddleware;
