import React, { Fragment } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Divider from '@material-ui/core/Divider';
import * as stylesheetSelectors from '../reducers/stylesheetSelectors';
import stacImmutableMapper from '../utils/stacImmutableMapper';

const styles = theme => ({
  thumbnailDiv: {
    margin: theme.spacing.unit,
    textAlign: 'center',
    minHeight: 100
  },
  thumbnail: {
    maxHeight: 250,
    maxWidth: '100%'
  },
  propertyList: {
    backgroundColor: theme.palette.grey['300']
  }
}
);
const ImageItemDetails = (props) => {
  const { activeImageItem, classes } = props;
  let node;
  if (activeImageItem && activeImageItem.size > 0) {
    const {
      thumbnail,
      title,
      uploaderName,
      provider,
      startDatetime,
      instrument
    } = stacImmutableMapper(activeImageItem);
    node = (
      <div
        style={{ maxHeight: 'calc(100vh - 70px)', overflowY: 'scroll' }}
      >
        <CardHeader
          title={title}
          subheader={uploaderName}
        />
        <Card
          className={classes.card}
        >
          <div className={classes.thumbnailDiv}>
            <img src={thumbnail} alt="wat" className={classes.thumbnail} />
          </div>
        </Card>
        <List component="nav">
          <ListItem button>
            <Avatar>
              <OpenInNewIcon />
            </Avatar>
            <ListItemText primary="Open In iD Editor" />
          </ListItem>
          <Divider />
          <ListItem button>
            <Avatar>
              <OpenInNewIcon />
            </Avatar>
            <ListItemText primary="Open In JOSM" />
          </ListItem>
          <Divider />
          <ListItem button>
            <Avatar>
              <FileCopyIcon />
            </Avatar>
            <ListItemText primary="Copy TMS Url" />
          </ListItem>
        </List>
        <List className={classes.propertyList}>
          <ListItem>
            <ListItemText
              primary="Provider"
              secondary={provider}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Start Date"
              secondary={new Date(startDatetime).toDateString()}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Instrument"
              secondary={instrument}
            />
          </ListItem>
        </List>
      </div>
    );
  } else {
    node = (
      <Fragment />
    );
  }
  return node;
};

ImageItemDetails.propTypes = {
  activeImageItem: ImmutablePropTypes.Map
};

const mapStateToProps = state => ({
  activeImageItem: stylesheetSelectors.getActiveImageItem(state)
});
export default withStyles(styles)(connect(mapStateToProps, null)(ImageItemDetails));
