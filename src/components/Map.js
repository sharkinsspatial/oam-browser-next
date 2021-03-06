/* eslint no-return-assign: 0, camelcase: 0, no-param-reassign: 0, prefer-spread: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import mapboxgl from 'mapbox-gl';
import { diff } from '@mapbox/mapbox-gl-style-spec';
import async from 'async';
import withWidth from '@material-ui/core/withWidth';
import * as stylesheetActionCreators
  from '../actions/stylesheetActionCreators';
import * as stylesheetSelectors from '../reducers/stylesheetSelectors';
import * as stylesheetConstants from '../constants/stylesheetConstants';
import MapLoadingProgress from './MapLoadingProgress';

const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const addLayers = (map) => {
  const {
    clusterLayer,
    clusterCountLayer,
    unclusteredPointLayer,
    centroidSource,
    imageFootprints,
    filteredItemsSource,
    imagePointsSource,
    imagePoints,
    activeImageItemSource,
    activeImageItem,
    activeImagePoint
  } = stylesheetConstants;

  map.addLayer({
    id: clusterLayer,
    type: 'circle',
    source: centroidSource,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        50,
        '#ff3333'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  });

  map.addLayer({
    id: clusterCountLayer,
    type: 'symbol',
    source: centroidSource,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  map.addLayer({
    id: unclusteredPointLayer,
    type: 'circle',
    source: centroidSource,
    filter: ['!has', 'point_count'],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  map.addLayer({
    id: imageFootprints,
    type: 'fill',
    source: filteredItemsSource,
    layout: {},
    paint: {
      'fill-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.6,
        0.2
      ],
      'fill-color': '#088'
    }
  });

  map.addLayer({
    id: activeImageItem,
    type: 'raster',
    source: activeImageItemSource,
    layout: {
      visibility: 'none'
    }
  });

  map.addLayer({
    id: imagePoints,
    type: 'circle',
    source: imagePointsSource,
    filter: ['==', ['get', 'id'], 0],
    paint: {
      'circle-color': '#088',
      'circle-radius': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        9,
        5
      ],
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  map.addLayer({
    id: activeImagePoint,
    type: 'circle',
    source: imagePointsSource,
    filter: ['==', ['get', 'id'], 0],
    paint: {
      'circle-color': '#ff3333',
      'circle-radius': 8,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });
};

const addSources = (map) => {
  const {
    centroidSource,
    filteredItemsSource,
    imagePointsSource,
    activeImageItemSource
  } = stylesheetConstants;

  // const centroidData = `${process.env.PUBLIC_URL}/itemCentroids.geojson`;
  const centroidData = `${process.env.REACT_APP_API_URL}/centroids`;
  map.addSource(centroidSource, {
    type: 'geojson',
    data: centroidData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  map.addSource(imagePointsSource, {
    type: 'geojson',
    data: centroidData,
  });

  map.addSource(filteredItemsSource, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: []
    }
  });

  map.addSource(activeImageItemSource, {
    type: 'raster',
    url: 'mapbox://mapbox.streets',
    tileSize: 256
  });
};

const configureCursor = (map) => {
  const {
    clusterLayer,
    unclusteredPointLayer,
    imagePoints
  } = stylesheetConstants;

  map.on('mouseenter', clusterLayer, (e) => {
    const { point_count } = e.features[0].properties;
    if (point_count < 50) {
      map.getCanvas().style.cursor = 'pointer';
    }
  });

  map.on('mouseleave', clusterLayer, () => {
    map.getCanvas().style.cursor = '';
  });

  map.on('mouseenter', unclusteredPointLayer, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', unclusteredPointLayer, () => {
    map.getCanvas().style.cursor = '';
  });

  map.on('mouseenter', imagePoints, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', imagePoints, () => {
    map.getCanvas().style.cursor = '';
  });
};

function traverseCluster(source, clusterId, completedCallback) {
  const clusterIds = [clusterId];
  const q = async.queue((task, callback) => {
    task.source.getClusterChildren(task.clusterId, (err, features) => {
      if (err) callback(err);

      const tasks = features
        .filter(feature => feature.properties.cluster)
        .map(feature => ({
          clusterId: feature.properties.cluster_id,
          source
        }));

      const taskIds = tasks.map(cued => cued.clusterId);
      clusterIds.push(...taskIds);
      q.push(tasks, (error) => {
        if (error) callback(error);
      });

      callback();
    });
  }, 1);

  q.push({ clusterId, source }, (err) => {
    if (err) {
      console.log(err);
    }
  });

  q.drain = (err) => {
    if (err) {
      console.log(err);
    }
    completedCallback(clusterIds);
  };
}

const onClusterClick = (clusterId, centroidSource, filterItems) => {
  centroidSource.getClusterLeaves(clusterId, Infinity, 0, (err, features) => {
    const featureIds = features.map(feature => feature.properties.id);
    traverseCluster(centroidSource, clusterId, (clusterIds) => {
      filterItems({ clusterIds, featureIds });
    });
  });
};

const mapClickHandler = (e, filterItems, setActiveImageItem) => {
  const map = e.target;
  const {
    clusterLayer,
    unclusteredPointLayer,
    imagePoints,
    centroidSource
  } = stylesheetConstants;

  const queryFeatures = map.queryRenderedFeatures(
    e.point,
    {
      layers: [clusterLayer, unclusteredPointLayer, imagePoints]
    }
  );
  if (queryFeatures.length > 0) {
    queryFeatures.forEach((feature) => {
      if (feature.layer.id === clusterLayer) {
        const { cluster_id, point_count } = feature.properties;
        if (point_count < 50) {
          const mapCentroidSource = map.getSource(centroidSource);
          onClusterClick(cluster_id, mapCentroidSource, filterItems);
        }
      }
      if (feature.layer.id === unclusteredPointLayer) {
        const { id } = feature.properties;
        filterItems({ clusterIds: [], featureIds: [id] });
      }
    });
    if (queryFeatures[0].layer.id === imagePoints) {
      const { id } = queryFeatures[0].properties;
      setActiveImageItem(id);
    }
  }
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  hoverHandler(e) {
    if (e.features.length > 0) {
      const { filteredItemsSource, imagePointsSource } = stylesheetConstants;
      const map = e.target;
      if (this.hoverId) {
        map.setFeatureState({
          source: filteredItemsSource,
          id: this.hoverId
        },
        { hover: false });
        map.setFeatureState({
          source: imagePointsSource,
          id: this.hoverId
        },
        { hover: false });
      }
      this.hoverId = e.features[0].id;
      map.setFeatureState({
        source: filteredItemsSource,
        id: this.hoverId
      },
      { hover: true });
      map.setFeatureState({
        source: imagePointsSource,
        id: this.hoverId
      },
      { hover: true });
    }
  }

  offHoverHandler(e) {
    const { filteredItemsSource, imagePointsSource } = stylesheetConstants;
    const map = e.target;
    if (this.hoverId) {
      map.setFeatureState({
        source: filteredItemsSource,
        id: this.hoverId
      },
      { hover: false });
      map.setFeatureState({
        source: imagePointsSource,
        id: this.hoverId
      },
      { hover: false });
    }
  }

  applyStyleChanges(style, nextStyle) {
    const changes = diff(style, nextStyle);
    if (changes.length > 0) {
      this.setState({ loading: true });
    }
    changes.forEach((change) => {
      const { map } = this;
      if (change.command === 'setGeoJSONSourceData') {
        // This is a workaround patch for updateSource not being
        // low level enough for a generic apply command - dff.js has also
        // been patched.
        map.getSource(change.args[0]).setData(change.args[1]);
      } else {
        map[change.command].apply(map, change.args);
      }
    });
  }

  componentDidMount() {
    const {
      setStyle,
      setStyleSucceeded,
      filterItems,
      setActiveImageItem,
      setClientSize,
      width,
      style
    } = this.props;

    if (width !== 'xs') {
      mapboxgl.accessToken = accessToken;
      const mapConfig = {
        container: this.node,
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [-103.59179687498357, 40.66995747013945],
        zoom: 3,
        attributionControl: false
      };
      this.hoverId = null;
      const map = new mapboxgl.Map(mapConfig);
      map.on('load', () => {
        addSources(map);
        addLayers(map);
        configureCursor(map);
        map.on('click', (e) => {
          mapClickHandler(e, filterItems, setActiveImageItem);
        });

        const { imagePoints } = stylesheetConstants;
        map.on('mousemove', imagePoints,
          this.hoverHandler);
        map.on('mouseleave', imagePoints,
          this.offHoverHandler);

        const resizeHandler = () => {
          const { clientHeight, clientWidth } = map.getCanvas();
          setClientSize({ clientWidth, clientHeight });
        };
        map.on('resize', resizeHandler);

        const loadedStyle = map.getStyle();
        if (style.size === 0) {
          setStyle(loadedStyle);
          setStyleSucceeded();
          const { clientHeight, clientWidth } = map.getCanvas();
          setClientSize({ clientWidth, clientHeight });
        } else {
          this.applyStyleChanges(loadedStyle, style.toJS());
        }
      });

      const onMapRender = (e) => {
        if (e.target && e.target.loaded()) {
          this.setState({ loading: false });
        }
      };
      this.onMapRender = onMapRender;

      map.on('render', this.onMapRender);

      this.map = map;
    }
  }

  componentWillUnmount() {
    this.map.off('render', this.onMapRender);
  }

  componentWillReceiveProps(nextProps) {
    const { style } = this.props;
    const nextStyle = nextProps.style;
    //  if (!Immutable.is(style, nextStyle)) {
    if (style !== nextStyle) {
      this.applyStyleChanges(style.toJS(), nextStyle.toJS());
    }
  }

  render() {
    const { width } = this.props;
    const { loading } = this.state;
    let mapDiv;
    const style = {
      position: 'absolute',
      top: 65,
      bottom: 0,
      width: width === 'sm' ? '50%' : '66.666%',
      overflow: 'hidden'
    };
    if (width === 'xs') {
      mapDiv = <div />;
    } else {
      mapDiv = (
        <React.Fragment>
          <div id="map" style={style} ref={c => this.node = c} />
          <MapLoadingProgress loading={loading} />
        </React.Fragment>
      );
    }
    return mapDiv;
  }
}

Map.propTypes = {
  style: ImmutablePropTypes.map.isRequired,
  setStyle: PropTypes.func.isRequired,
  filterItems: PropTypes.func.isRequired,
  setActiveImageItem: PropTypes.func.isRequired,
  setClientSize: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired,
  setStyleSucceeded: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  style: stylesheetSelectors.getStyle(state)
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(
    Object.assign({}, stylesheetActionCreators), dispatch
  )
);

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(Map));
