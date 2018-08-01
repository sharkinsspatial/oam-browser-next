/* eslint no-return-assign: 0 */
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
import * as stylesheetActionCreators
  from '../actions/stylesheetActionCreators';
import * as stylesheetSelectors from '../reducers/stylesheetSelector';

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
    const map = new mapboxgl.Map(mapConfig);
    map.addControl(new ReduxMapControl(map));
    map.on('load', () => {
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
