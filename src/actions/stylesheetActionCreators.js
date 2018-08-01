import * as types from '../constants/action_types';

export function setStyle(style) {
  return {
    type: types.SET_STYLE,
    payload: {
      style
    }
  };
}
