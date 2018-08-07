import * as types from '../constants/action_types';

export function setStyle(style) {
  return {
    type: types.SET_STYLE,
    payload: {
      style
    }
  };
}

export function filterItems(payload) {
  return {
    type: types.FILTER_ITEMS,
    payload
  };
}

export function setClientSize(payload) {
  return {
    type: types.SET_CLIENT_SIZE,
    payload
  };
}

export function setActiveImageItem(payload) {
  return {
    type: types.SET_ACTIVE_IMAGE_ITEM,
    payload
  };
}
