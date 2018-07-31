import * as types from '../constants/action_types';

export function fetchItems() {
  return {
    type: types.CALL_API,
    payload: {
      endpoint: 'itemCentroids.geojson',
      authenticated: false,
      types: [
        types.FETCH_ITEMS,
        types.FETCH_ITEMS_SUCCEEDED,
        types.FETCH_ITEMS_FAILED
      ],
      method: 'GET'
    }
  };
}
