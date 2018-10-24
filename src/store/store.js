import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerForBrowser, initializeCurrentLocation }
  from 'redux-little-router';
import thunk from 'redux-thunk';
//import { mapMiddleware } from '@mapbox/mapbox-gl-redux';
import reducer from '../reducers/reducer';
import stylesheetReducer from '../reducers/stylesheetReducer';
import authReducer from '../reducers/authReducer';
import routes from '../constants/routes';
import locationMiddleware from './locationMiddleware';
import apiMiddleware from './apiMiddleware';
import filterMiddleware from './filterMiddleware';


const {
  reducer: routerReducer,
  middleware: routerMiddleware,
  enhancer
} = routerForBrowser({ routes });

const initialState = {};
const store = createStore(
  combineReducers({
    router: routerReducer,
    stylesheet: stylesheetReducer,
    auth: authReducer,
    reducer
  }),
  initialState,
  compose(
    enhancer,
    applyMiddleware(
      thunk,
      routerMiddleware,
      locationMiddleware,
      apiMiddleware,
      filterMiddleware
    )
  )
);

const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}
export default store;
