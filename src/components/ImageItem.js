/* eslint react/require-default-props: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const styles = () => ({
  title: {
    fontSize: '0.8rem'
  },
  subtitle: {
    fontSize: '0.7rem'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  }
});

const ImageItem = ({
  id,
  thumbUri,
  title,
  provider,
  push,
  cols = 1,
  classes,
  ...other
}) => (
  <GridListTile key={id} cols={cols} {...other}>
    <img src={thumbUri} alt={title} />
    <GridListTileBar
      classes={{
        title: classes.title,
        subtitle: classes.subtitle
      }}
      title={title}
      subtitle={provider}
      actionIcon={(
        <IconButton
          key={id}
          className={classes.icon}
          onClick={() => push(`/imageitems/${id}`)}
        >
          <InfoIcon />
        </IconButton>
      )}
    />
  </GridListTile>
);

ImageItem.propTypes = {
  id: PropTypes.string.isRequired,
  thumbUri: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  cols: PropTypes.number,
  classes: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(ImageItem);
