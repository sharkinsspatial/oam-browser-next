import { Map, fromJS } from 'immutable';
import * as actions from '../constants/action_types';
const style = Map({});

export default function StylesheetReducer(styleState = style, action) {
  switch(action.type) {
    case actions.SET_STYLE: {
      return fromJS(action.payload);
    }
  }
}
