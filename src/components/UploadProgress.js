import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import * as uploadsSelectors from '../reducers/uploadsSelectors';

const styles = theme => ({
  progress: {
    marginLeft: theme.spacing.unit * 2
  },
});

export const UploadsProgress = (props) => {
  const { uploads, classes } = props;
  const uploadProgressTrackers = Object.keys(uploads).map(key => (
    <CircularProgress
      key={key}
      className={classes.progress}
      variant="static"
      value={uploads[key].progress}
    />
  ));
  let label;
  if (Object.keys(uploads).length > 0) {
    label = (
      <Typography
        className={classes.progress}
        variant="overline"
      >
        Upload progress
      </Typography>
    );
  } else {
    label = <div />;
  }
  return (
    <React.Fragment>
      {label}
      {uploadProgressTrackers}
    </React.Fragment>
  );
};

UploadsProgress.propTypes = {
  uploads: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  uploads: uploadsSelectors.getUploads(state)
});

export default withStyles(styles)(connect(mapStateToProps, null)(UploadsProgress));
