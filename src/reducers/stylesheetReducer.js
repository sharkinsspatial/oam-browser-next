import { Map, fromJS } from 'immutable';
import bbox from '@turf/bbox';
import geoViewport from '@mapbox/geo-viewport';
import url from 'url';
import * as actions from '../constants/action_types';
import * as stylesheetConstants from '../constants/stylesheetConstants';

const buildFilters = (clusterIds, featureIds) => {
  let clusterFilter;
  if (clusterIds.length > 1) {
    clusterFilter = [
      '!',
      ['match',
        ['to-number', ['get', 'cluster_id']],
        clusterIds,
        true,
        false
      ]
    ];
  }

  const unclusteredPointFilter = [
    'all',
    ['!',
      ['has', 'point_count']
    ],
    ['match',
      ['to-string', ['get', 'id']],
      featureIds,
      false,
      true
    ]
  ];

  const imagePointsFilter = [
    'match',
    ['get', 'id'],
    featureIds,
    true,
    false
  ];

  return { clusterFilter, unclusteredPointFilter, imagePointsFilter };
};

const filterItems = (state, payload) => {
  const {
    clusterLayer,
    clusterCountLayer,
    unclusteredPointLayer,
    imagePoints
  } = stylesheetConstants;

  const {
    clusterFilter,
    unclusteredPointFilter,
    imagePointsFilter
  } = buildFilters(payload.clusterIds, payload.featureIds);

  let clusterFilterState;
  const filterState = state.withMutations((tempState) => {
    tempState.updateIn(['style', 'layers'], (list) => {
      const idx = list.findIndex(layer => layer.get('id') === unclusteredPointLayer);
      return list.setIn([idx, 'filter'], fromJS(unclusteredPointFilter));
    });
    tempState.updateIn(['style', 'layers'], (list) => {
      const idx = list.findIndex(layer => layer.get('id') === imagePoints);
      return list.setIn([idx, 'filter'], fromJS(imagePointsFilter));
    });
    tempState.merge({ featureIds: fromJS(payload.featureIds) });
  });

  if (clusterFilter) {
    clusterFilterState = filterState.withMutations((tempState) => {
      tempState.updateIn(['style', 'layers'], (list) => {
        const idx = list.findIndex(layer => layer.get('id') === clusterLayer);
        return list.setIn([idx, 'filter'], fromJS(clusterFilter));
      });
      tempState.updateIn(['style', 'layers'], (list) => {
        const idx = list.findIndex(layer => layer.get('id') === clusterCountLayer);
        return list.setIn([idx, 'filter'], fromJS(clusterFilter));
      });
    });
  }
  return clusterFilterState || filterState;
};

const getViewport = (state, geoJSON) => {
  const bounds = bbox(geoJSON);
  const clientSize = state.get('clientSize');
  const dimensions = [
    clientSize.get('clientWidth'),
    clientSize.get('clientHeight')
  ];
  const viewport = geoViewport.viewport(
    bounds,
    dimensions,
    undefined,
    undefined,
    512,
    true
  );
  return viewport;
};

const setFilteredDataSource = (state, payload) => {
  const { filteredItemsSource } = stylesheetConstants;
  const filteredFeatures = payload.json.features.filter(
    item => state.get('featureIds').find(id => id === item.properties.id)
  );
  const filteredFeatureCollection = {
    type: 'FeatureCollection',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
    features: filteredFeatures
  };
  const viewport = getViewport(state, filteredFeatureCollection);
  const newState = state.withMutations((tempState) => {
    tempState.setIn(['style', 'center'], fromJS(viewport.center));
    tempState.setIn(['style', 'zoom'], viewport.zoom - 0.5);
    tempState.setIn(['style', 'sources', filteredItemsSource, 'data'],
      fromJS(filteredFeatureCollection));
  });
  return newState;
};

const unSetActiveImageItem = (state) => {
  const {
    activeImageItem,
    activeImagePoint
  } = stylesheetConstants;

  const newState = state.withMutations((tempState) => {
    tempState.set('activeImageItemId', '');
    tempState.updateIn(
      ['style', 'layers'],
      (layers) => {
        const index = layers
          .findIndex(layer => layer.get('id') === activeImageItem);
        return layers.setIn([index, 'layout', 'visibility'], 'none');
      }
    );
    tempState.updateIn(
      ['style', 'layers'],
      (layers) => {
        const index = layers
          .findIndex(layer => layer.get('id') === activeImagePoint);
        return layers.setIn([index, 'filter', 2], 0);
      }
    );
  });
  return newState;
};

const setActiveImageItem = (state, payload) => {
  const { imageId } = payload;
  const {
    filteredItemsSource,
    activeImageItemSource,
    activeImageItem,
    activeImagePoint
  } = stylesheetConstants;

  const features = state
    .getIn([
      'style',
      'sources',
      filteredItemsSource,
      'data',
      'features']);

  const imageItem = features
    .find(feature => feature.getIn(['properties', 'id']) === imageId);

  const imageItemJS = imageItem.toJS();
  const viewport = getViewport(state, imageItemJS);

  const imagePath = url.parse(imageItemJS.properties.uuid).path.split('.')[0];

  const tilePath = `https://tiles.openaerialmap.org${imagePath}`;

  const newState = state.withMutations((tempState) => {
    tempState.set('activeImageItemId', imageId);
    tempState.setIn(['style', 'center'], fromJS(viewport.center));
    tempState.setIn(['style', 'zoom'], viewport.zoom - 0.5);
    tempState.setIn(
      ['style', 'sources', activeImageItemSource, 'url'], tilePath
    );
    tempState.updateIn(
      ['style', 'layers'],
      (layers) => {
        const index = layers
          .findIndex(layer => layer.get('id') === activeImageItem);
        return layers.setIn([index, 'layout', 'visibility'], 'visible');
      }
    );
    tempState.updateIn(
      ['style', 'layers'],
      (layers) => {
        const index = layers
          .findIndex(layer => layer.get('id') === activeImagePoint);
        return layers.setIn([index, 'filter', 2], imageId);
      }
    );
  });
  return newState;
};

const initialState = Map({
  style: fromJS({}),
  activeImageItemId: ''
});

export default function stylesheetReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STYLE: {
      return state.merge({
        style: fromJS(action.payload.style)
      });
    }

    case actions.FILTER_ITEMS: {
      return unSetActiveImageItem(filterItems(state, action.payload));
    }

    case actions.FETCH_FILTERED_ITEMS_SUCCEEDED: {
      return setFilteredDataSource(state, action.payload);
    }

    case actions.SET_CLIENT_SIZE: {
      return state.merge({
        clientSize: fromJS(action.payload)
      });
    }

    case actions.SET_ACTIVE_IMAGE_ITEM: {
      return setActiveImageItem(state, action.payload);
    }

    default: {
      return state;
    }
  }
}
