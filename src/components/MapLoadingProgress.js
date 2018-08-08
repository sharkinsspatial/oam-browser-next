import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

const MapLoadingProgress = (props) => {
  const { loading } = props;
  let content;
  if (loading) {
    content = (
      <div style={{ marginLeft: '50%', marginTop: '30%' }}>
        <CircularProgress
          size={80}
          color="secondary"
        />
      </div>
    );
  } else {
    content = <div />;
  }
  return content;
};

MapLoadingProgress.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default MapLoadingProgress;
