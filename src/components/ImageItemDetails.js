import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
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
      uploaderName
    } = stacImmutableMapper(activeImageItem);
    node = (
      <Fragment>
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
        <List>
          <ListItem>
            <Avatar>
              <OpenInNewIcon />
            </Avatar>
            <ListItemText primary="Open In iD Editor" />
          </ListItem>
          <Divider />
          <ListItem>
            <Avatar>
              <OpenInNewIcon />
            </Avatar>
            <ListItemText primary="Open In JOSM" />
          </ListItem>
        </List>
      </Fragment>
    );
  } else {
    node = (
      <Fragment />
    );
  }
  return node;
};

const mapStateToProps = state => ({
  activeImageItem: stylesheetSelectors.getActiveImageItem(state)
});
export default withStyles(styles)(connect(mapStateToProps, null)(ImageItemDetails));
