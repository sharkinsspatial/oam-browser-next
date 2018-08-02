import { Map, fromJS } from 'immutable';
import * as actions from '../constants/action_types';
//import { MapActionTypes } from '@mapbox/mapbox-gl-redux';

const initialState = Map({ style: fromJS({}) });
export default function stylesheetReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STYLE: {
      return state.merge({
        style: fromJS(action.payload.style)
      }); }

    default: {
      return state;
    }
  }
}
