import { Map, fromJS } from 'immutable';
import * as actions from '../constants/action_types';
import * as stylesheetConstants from '../constants/stylesheetConstants';

const filterItems = (state, payload) => {
  const {
    clusterLayer,
    clusterCountLayer,
    unclusteredPointLayer
  } = stylesheetConstants;

  const newState = state
    .updateIn(['style', 'layers'], (list) => {
      const idx = list.findIndex(layer => layer.get('id') === clusterLayer);
      return list.setIn([idx, 'filter'], fromJS(payload.clusterFilter));
    })
    .updateIn(['style', 'layers'], (list) => {
      const idx = list.findIndex(layer => layer.get('id') === clusterCountLayer);
      return list.setIn([idx, 'filter'], fromJS(payload.clusterFilter));
    })
    .updateIn(['style', 'layers'], (list) => {
      const idx = list.findIndex(layer => layer.get('id') === unclusteredPointLayer);
      return list.setIn([idx, 'filter'], fromJS(payload.pointFilter));
    });

  return newState;
};

const initialState = Map({ style: fromJS({}) });

export default function stylesheetReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STYLE: {
      return state.merge({
        style: fromJS(action.payload.style)
      }); }

    case actions.FILTER_ITEMS: {
      return filterItems(state, action.payload);
    }

    default: {
      return state;
    }
  }
}
