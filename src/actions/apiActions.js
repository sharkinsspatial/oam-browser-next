import * as types from '../constants/action_types';

export function fetchItems() {
  return {
    type: types.CALL_API,
    payload: {
      endpoint: 'itemCentroids.geojson',
      authenticated: false,
      types: {
        requestType: types.FETCH_ITEMS,
        successType: types.FETCH_ITEMS_SUCCEEDED,
        errorType: types.FETCH_ITEMS_FAILED
      },
      method: 'GET'
    }
  };
}

export function fetchFilteredItems(itemIds) {
  return {
    type: types.CALL_API,
    payload: {
      endpoint: 'items.geojson',
      authenticated: false,
      types: {
        requestType: types.FETCH_FILTERED_ITEMS,
        successType: types.FETCH_FILTERED_ITEMS_SUCCEEDED,
        errorType: types.FETCH_FILTERED_ITEMS_FAILED
      },
      method: 'GET'
    }
  };
}
