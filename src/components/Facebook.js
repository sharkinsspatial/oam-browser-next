/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import FacebookIcon from './FacebookIcon';

const authUrl = `${process.env.REACT_APP_API_URL}/oauth/facebook`;

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
    fontSize: 25
  }
});

const Facebook = (props) => {
  const { classes } = props;
  return (
    <Button
      color="default"
      className={classes.button}
      onClick={() => { window.open(authUrl); }}
    >
      <FacebookIcon className={classes.leftIcon} />
      Facebook
    </Button>
  );
};

Facebook.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.string.isRequired,
    leftIcon: PropTypes.string.isRequired
  }).isRequired
};
export default withStyles(styles)(Facebook);
