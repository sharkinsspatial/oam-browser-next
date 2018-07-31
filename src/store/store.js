import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerForBrowser, initializeCurrentLocation }
  from 'redux-little-router';
import thunk from 'redux-thunk';
import reducer from '../reducers/reducer';
import routes from '../constants/routes';
import locationMiddleware from './locationMiddleware';
import apiMiddleware from './apiMiddleware';

const {
  reducer: routerReducer,
  middleware: routerMiddleware
} = routerForBrowser({ routes });

const initialState = {};
const store = createStore(
  combineReducers({ router: routerReducer, reducer }),
  initialState,
  applyMiddleware(
    thunk,
    routerMiddleware,
    locationMiddleware,
    apiMiddleware
  )
);

const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}
export default store;
