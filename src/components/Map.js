/* eslint no-return-assign: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import Measure from 'react-measure';
// import { diff } from '@mapbox/mapbox-gl-style-spec';
import * as mapActionCreators from '../actions/mapActions';

class Map extends Component {
  componentDidMount() {
    const { setStyle } = this.props;
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhcmtpbnMiLCJhIjoiOFRmb0o1SSJ9.PMTjItrVcqcO8xBfgP1pMw';
    const mapConfig = {
      container: this.node,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-103.59179687498357, 40.66995747013945],
      zoom: 3,
      attributionControl: false
    };
    this.map = new mapboxgl.Map(mapConfig);
    this.map.on('load', () => {
      const style = this.map.getStyle();
      setStyle(style);
    });
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
  setStyle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, mapActionCreators)(Map);
