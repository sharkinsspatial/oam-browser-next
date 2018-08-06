import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

const ImageItem = (props) => {
  const {
    id,
    thumbUri,
    title,
    provider
  } = props;
  return (
    <GridListTile key={id}>
      <img src={thumbUri} alt={title} />
      <GridListTileBar
        title={title}
        subtitle={provider}
      />
    </GridListTile>
  );
};

ImageItem.propTypes = {
  id: PropTypes.string.isRequired,
  thumbUri: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired
};

export default ImageItem;
