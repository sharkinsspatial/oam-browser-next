import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Fragment } from 'redux-little-router';
import LogoIcon from './LogoIcon';
import Map from './Map';
import ImageItems from './ImageItems';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  logoIcon: {
    marginLeft: -12,
    marginRight: 20,
    fontSize: 40
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  sidebar: {
    padding: theme.spacing.unit,
    color: theme.palette.text.secondary,
  }
});

export const Container = (props) => {
  const { classes } = props;
  return (
    <Fragment forRoute="/">
      <div className={classes.root}>
        <AppBar
          position="static"
          color="default"
          className={classes.appBar}
        >
          <Toolbar>
            <LogoIcon className={classes.logoIcon} />
            <Typography
              variant="title"
              color="inherit"
            >
              OpenAerialMap
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={0}>
          <Grid
            className={classes.sidebar}
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Fragment forRoute="/imageitems/:imageId">
              <div />
            </Fragment>
            <Fragment withConditions={location => location.route === '/'}>
              <ImageItems />
            </Fragment>
          </Grid>
          <Grid
            item
            xs={1}
            sm={6}
            md={8}
          >
            <Map />
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

Container.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(Container);
