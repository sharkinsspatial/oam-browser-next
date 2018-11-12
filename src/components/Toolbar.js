import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import UploadsProgress from './UploadProgress';
import Login from './Login';
import LogoIcon from './LogoIcon';
import Menu from './Menu';

const styles = () => ({
  logoIcon: {
    marginLeft: -12,
    marginRight: 20,
    fontSize: 40,
    '&:hover': {
      opacity: 0.5
    },
    cursor: 'pointer'
  },
  rightToolbar: {
    marginLeft: 'auto',
    marginRight: -12,
  }
});
const OAMToolbar = (props) => {
  const { classes } = props;
  return (
    <Toolbar>
      <LogoIcon className={classes.logoIcon} />
      <Typography
        variant="h6"
        color="inherit"
      >
        OpenAerialMap
      </Typography>
      <UploadsProgress />
      <div
        className={classes.rightToolbar}
      >
        <Login>
          Login
        </Login>
      </div>
      <Menu />
    </Toolbar>
  );
};

OAMToolbar.propTypes = {
  classes: PropTypes.shape({
    logoIcon: PropTypes.string.isRequired,
    rightToolbar: PropTypes.string.isRequired
  }).isRequired
};
export default withStyles(styles)(OAMToolbar);
