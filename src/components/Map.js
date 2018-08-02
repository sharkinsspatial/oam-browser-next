/* eslint no-return-assign: 0, camelcase: 0, no-param-reassign: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import mapboxgl from 'mapbox-gl';
import Measure from 'react-measure';
import { diff } from '@mapbox/mapbox-gl-style-spec';
import Immutable from 'immutable';
import { ReduxMapControl, MapActionCreators } from '@mapbox/mapbox-gl-redux';
import async from 'async';
import * as stylesheetActionCreators
  from '../actions/stylesheetActionCreators';
import * as stylesheetSelectors from '../reducers/stylesheetSelector';
import * as stylesheetConstants from '../constants/stylesheetConstants';

const addLayers = (map) => {
  const {
    clusterLayer,
    clusterCountLayer,
    unclusteredPointLayer,
    centroidSource
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
};

const addSources = (map) => {
  const { centroidSource } = stylesheetConstants;
  const centroidData = `${process.env.PUBLIC_URL}/itemCentroids.geojson`;
  map.addSource(centroidSource, {
    type: 'geojson',
    data: centroidData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });
};

const configureCursor = (map) => {
  const { clusterLayer, unclusteredPointLayer } = stylesheetConstants;
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
      const clusterFilter = [
        '!', ['any',
          ['match',
            ['to-number', ['get', 'cluster_id']],
            clusterIds,
            true,
            false
          ],
          ['match',
            ['to-string', ['get', 'id']],
            featureIds,
            true,
            false
          ]
        ]];
        // map.setFilter('clusters', clusterFilter);
        // map.setFilter('cluster-count', clusterFilter);

      const pointFilter = [
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

      filterItems({ clusterFilter, pointFilter, featureIds });
        // map.setFilter('unclustered-point', pointFilter);
        // setVisibleItems(featureIds);
    });
  });
};

const mapClickHandler = (e, filterItems) => {
  const map = e.target;
  const {
    clusterLayer,
    unclusteredPointLayer,
    centroidSource
  } = stylesheetConstants;

  const queryFeatures = map.queryRenderedFeatures(
    e.point,
    {
      layers: [clusterLayer, unclusteredPointLayer]
    }
  );
  if (queryFeatures.length > 0) {
    if (queryFeatures[0].layer.id === clusterLayer) {
      const { cluster_id, point_count } = queryFeatures[0].properties;
      if (point_count < 50) {
        const mapCentroidSource = map.getSource(centroidSource);
        onClusterClick(cluster_id, mapCentroidSource, filterItems);
      }
    }
    if (queryFeatures[0].layer.id === unclusteredPointLayer) {
      const { id } = queryFeatures[0].properties;
      // setVisibleItems([id]);
    }
  }
};


class Map extends Component {
  componentDidMount() {
    const { setStyle, filterItems } = this.props;
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhcmtpbnMiLCJhIjoiOFRmb0o1SSJ9.PMTjItrVcqcO8xBfgP1pMw';
    const mapConfig = {
      container: this.node,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-103.59179687498357, 40.66995747013945],
      zoom: 3,
      attributionControl: false
    };
    const map = new mapboxgl.Map(mapConfig);
    map.addControl(new ReduxMapControl(map));
    map.on('load', () => {
      addSources(map);
      addLayers(map);
      configureCursor(map);
      map.on('click', (e) => {
        mapClickHandler(e, filterItems);
      });
      const style = map.getStyle();
      setStyle(style);
    });
    this.map = map;
  }

  componentWillReceiveProps(nextProps) {
    const { style } = this.props;
    const nextStyle = nextProps.style;

    if (!Immutable.is(style, nextStyle)) {
      const changes = diff(style.toJS(), nextStyle.toJS());
      changes.forEach((change) => {
        const { map } = this;
        map[change.command].apply(map, change.args);

        //if(change.command == 'updateSource'){
          //// This is a workaround patch for updateSource not being
          //// low level enough for a generic apply command - dff.js has also
          //// been patched.
          //map.getSource(change.args[0]).setData(change.args[1].data);
        //} else {
          //console.log(change);
          //map[change.command].apply(map, change.args);
        //}
        
      });
    }
  }

  render() {
    const style = {
      position: 'absolute',
      top: 64,
      bottom: 0,
      width: '80%'
    };
    return (
      <Measure onResize={(contentRect) => {
      }}
      >
        {({ measureRef }) => (
          <div ref={measureRef}>
            <div id="map" style={style} ref={c => this.node = c} />
          </div>
        )
      }
      </Measure>
    );
  }
}

Map.propTypes = {
  setStyle: PropTypes.func.isRequired,
  filterItems: PropTypes.func.isRequired,
  style: ImmutablePropTypes.map.isRequired
};

const mapStateToProps = state => ({
  style: stylesheetSelectors.getStyle(state)
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(
    Object.assign({}, stylesheetActionCreators, MapActionCreators), dispatch
  )
);

export default connect(mapStateToProps, mapDispatchToProps)(Map);
