import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux';
import Immutable from 'immutable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerForBrowser, initializeCurrentLocation }
  from 'redux-little-router';
import thunk from 'redux-thunk';
import reduxClipboardCopy from 'redux-clipboard-copy';
// import { mapMiddleware } from '@mapbox/mapbox-gl-redux';
import reducer from '../reducers/reducer';
import stylesheetReducer from '../reducers/stylesheetReducer';
import authReducer from '../reducers/authReducer';
import uploadsReducer from '../reducers/uploadsReducer';
import routes from '../constants/routes';
import locationMiddleware from './locationMiddleware';
import apiMiddleware from './apiMiddleware';
import filterMiddleware from './filterMiddleware';
import uploadMiddleware from './uploadMiddleware';
import authMiddleware from './authMiddleware';

const {
  reducer: routerReducer,
  middleware: routerMiddleware,
  enhancer
} = routerForBrowser({ routes });

const composeEnhancers = composeWithDevTools({
  serialize: {
    immutable: Immutable
  }
});

const initialState = {};
const store = createStore(
  combineReducers({
    router: routerReducer,
    stylesheet: stylesheetReducer,
    auth: authReducer,
    uploads: uploadsReducer,
    reducer
  }),
  initialState,
  composeEnhancers(
    enhancer,
    applyMiddleware(
      thunk,
      routerMiddleware,
      locationMiddleware,
      apiMiddleware,
      filterMiddleware,
      uploadMiddleware,
      authMiddleware,
      reduxClipboardCopy
    )
  )
);

const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}
export default store;
