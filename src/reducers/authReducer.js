import { Map } from 'immutable';
import * as actions from '../constants/action_types';

const initialState = Map({
  hasValidToken: false
});

export default function stylesheetReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_HAS_VALID_TOKEN: {
      return state.merge({
        hasValidToken: action.payload.hasValidToken
      });
    }

    default: {
      return state;
    }
  }
}
