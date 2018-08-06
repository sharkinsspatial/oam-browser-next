import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import * as stylesheetSelectors from '../reducers/stylesheetSelectors';
import ImageItem from './ImageItem';

const ImageItems = (props) => {
  const { imageItems } = props;
  const items = imageItems.map((item) => {
    const id = item.getIn(['properties', 'id']);
    const thumbUri = item.getIn(['properties', 'thumb_uri']);
    const title = item.getIn(['properties', 'title']);
    const provider = item.getIn(['properties', 'provider']);
    //return (
      //<ImageItem
        //key={id}
        //id={id}
        //thumbUri={thumbUri}
        //title={title}
        //provider={provider}
      ///>
    //);
    return (
      <GridListTile key={id}>
        <img src={thumbUri} alt={title} />
        <GridListTileBar
          title={title}
          subtitle={provider}
        />
      </GridListTile>
    );
  });
  return (
    <GridList
      style={{ maxHeight: 'calc(100vh - 70px)', overflowY: 'scroll' }}
      cellHeight={180}
    >
      <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
        <ListSubheader component="div">December</ListSubheader>
      </GridListTile>
      {items}
    </GridList>
  );
};

ImageItems.propTypes = {
  imageItems: ImmutablePropTypes.list.isRequired
};

const mapStateToProps = state => ({
  imageItems: stylesheetSelectors.getFilteredItems(state)
});

export default connect(mapStateToProps, null)(ImageItems);
