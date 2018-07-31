import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LogoIcon from './LogoIcon';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  item: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderStyle: 'solid'
  },
  logoIcon: {
    marginLeft: -12,
    marginRight: 20,
    fontSize: 40
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
});

const Container = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" className={classes.appBar}>
        <Toolbar>
          <LogoIcon className={classes.logoIcon} />
          <Typography variant="title" color="inherit">
            OpenAerialMap
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={0}>
        <Grid item xs={4}>
          <div className={classes.item}>xs=4</div>
        </Grid>
        <Grid item xs={8}>
          <div className={classes.item}>xs=8</div>
        </Grid>
      </Grid>
    </div>
  );
};

Container.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    item: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(Container);
