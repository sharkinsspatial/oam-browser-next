import test from 'tape';
import { fromJS } from 'immutable';
import * as actions from '../src/constants/action_types';
import * as stylesheetConstants from '../src/constants/stylesheetConstants';
import stylesheetReducer from '../src/reducers/stylesheetReducer';
import stylesheet from './stylesheet.json';

test('stylesheetReducer', (t) => {
  const state = fromJS({
    style: stylesheet
  });
  const action = {
    type: actions.FILTER_ITEMS,
    payload: {
      clusterIds: [],
      featureIds: ['feature1', 'feature2']
    }
  };
  const newState = stylesheetReducer(state, action);
  const { unclusteredPointLayer, clusterLayer } = stylesheetConstants;
  const layers = newState.getIn(['style', 'layers']);

  const unclusteredPointIndex = layers.findIndex(
    layer => layer.get('id') === unclusteredPointLayer
  );
  const featureIds = layers.get(unclusteredPointIndex).getIn(['filter', 2, 2]);

  const clusterLayerIndex = layers.findIndex(
    layer => layer.get('id') === clusterLayer
  );
  const clusterFilter = layers.get(clusterLayerIndex).get('filter');

  t.equal(featureIds.get(0), action.payload.featureIds[0],
    'Updates unclusteredPointLayer filter with correct featureIds');
  t.equal(featureIds.get(1), action.payload.featureIds[1],
    'Updates unclusteredPointLayer filter with correct featureIds');

  t.equal(clusterFilter.get(0), 'has',
    'Does not update clusterFilter when a single point is clicked');

  t.end();
});

test('stylesheetReducer', (t) => {
  const state = fromJS({
    style: stylesheet
  });
  const action = {
    type: actions.FILTER_ITEMS,
    payload: {
      clusterIds: [0, 1],
      featureIds: ['feature1', 'feature2']
    }
  };
  const newState = stylesheetReducer(state, action);
  const { clusterLayer } = stylesheetConstants;
  const layers = newState.getIn(['style', 'layers']);

  const clusterLayerIndex = layers.findIndex(
    layer => layer.get('id') === clusterLayer
  );
  const clusterIds = layers.get(clusterLayerIndex).getIn(['filter', 1, 2]);

  t.equal(clusterIds.get(0), action.payload.clusterIds[0],
    'Updates clusterFilter with clusterIds when a cluster is clicked');

  t.equal(clusterIds.get(1), action.payload.clusterIds[1],
    'Updates clusterFilter with clusterIds when a cluster is clicked');

  t.end();
});
