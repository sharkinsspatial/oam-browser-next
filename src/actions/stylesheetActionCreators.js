import * as types from '../constants/action_types';

export function setStyle(style) {
  return {
    type: types.SET_STYLE,
    payload: {
      style
    }
  };
}

export function setStyleSucceeded() {
  return {
    type: types.SET_STYLE_SUCCEEDED,
    payload: {
    }
  };
}
export function filterItems(payload) {
  return {
    type: types.FILTER_ITEMS,
    payload
  };
}

export function filterItem(payload) {
  return {
    type: types.FILTER_ITEM,
    payload
  };
}

export function setClientSize(payload) {
  return {
    type: types.SET_CLIENT_SIZE,
    payload
  };
}

export function setActiveImageItem(imageId) {
  return {
    type: types.SET_ACTIVE_IMAGE_ITEM,
    payload: {
      imageId
    }
  };
}

export function turnOffPointLayers() {
  return {
    type: types.TURN_OFF_POINT_LAYERS
  };
}

export function turnOnPointLayers() {
  return {
    type: types.TURN_ON_POINT_LAYERS
  };
}
