import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'redux-little-router';
import { setActiveImageItem } from '../actions/stylesheetActionCreators';
import * as stylesheetSelectors from '../reducers/stylesheetSelectors';
import ImageItem from './ImageItem';

const styles = theme => ({
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

export const ImageItems = (props) => {
  const {
    imageItems,
    push: dispatchPush,
    setActiveImageItem: dispatchSetActiveImageItem,
    activeImageItemId,
    classes
  } = props;

  const items = imageItems.map((item) => {
    const id = item.getIn(['properties', 'id']);
    const thumbnail = item.getIn(['assets', 'thumbnail', 'href']);
    const title = item.getIn(['properties', 'title']);
    const provider = item.getIn([
      'properties',
      'item:providers',
      0,
      'name'
    ]);
    return (
      <ImageItem
        key={id}
        id={id}
        thumbnail={thumbnail}
        title={title}
        provider={provider}
        push={dispatchPush}
        setActiveImageItem={dispatchSetActiveImageItem}
        activeImageItemId={activeImageItemId}
      />
    );
  });
  return (
    <GridList
      style={{ maxHeight: 'calc(100vh - 70px)', overflowY: 'scroll' }}
      cellHeight={180}
    >
      <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
        <ListSubheader component="div">
          <Typography variant="h6">
            OpenAerialMap (OAM) is a set of tools for searching,
            sharing, and using openly licensed satellite and unmanned aerial
            vehicle (UAV) imagery.
          </Typography>
          <Typography
            variant="body1"
            className={classes.instructions}
          >
            To get started click on a cluster to view the images it contains.
            If the cluster is red, zoom in until it splits into smaller clusters.
          </Typography>
        </ListSubheader>
      </GridListTile>
      {items}
    </GridList>
  );
};

ImageItems.propTypes = {
  imageItems: ImmutablePropTypes.list.isRequired,
  push: PropTypes.func.isRequired,
  setActiveImageItem: PropTypes.func.isRequired,
  activeImageItemId: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  imageItems: stylesheetSelectors.getFilteredItems(state),
  activeImageItemId: stylesheetSelectors.getActiveImageItemId(state)
});

const mapDispatchToProps = { push, setActiveImageItem };

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ImageItems));
