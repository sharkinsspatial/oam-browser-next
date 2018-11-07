import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import { push } from 'redux-little-router';
import { setActiveImageItem } from '../actions/stylesheetActionCreators';
import * as stylesheetSelectors from '../reducers/stylesheetSelectors';
import ImageItem from './ImageItem';

export const ImageItems = (props) => {
  const {
    imageItems,
    push: dispatchPush,
    setActiveImageItem: dispatchSetActiveImageItem,
    activeImageItemId
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
          OAM
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
  activeImageItemId: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  imageItems: stylesheetSelectors.getFilteredItems(state),
  activeImageItemId: stylesheetSelectors.getActiveImageItemId(state)
});

const mapDispatchToProps = { push, setActiveImageItem };

export default connect(mapStateToProps, mapDispatchToProps)(ImageItems);
