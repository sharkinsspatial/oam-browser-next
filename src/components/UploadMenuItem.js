import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { connect } from 'react-redux';
import { replace } from 'redux-little-router';
import * as authSelectors from '../reducers/authSelectors';

const UploadMenuItem = ({ replace: dispatchReplace, hasValidToken, close }) => (
  <MenuItem
    disabled={!hasValidToken}
    onClick={() => {
      dispatchReplace('/uploads');
      close();
    }}
  >
    <ListItemIcon>
      <CloudUploadIcon />
    </ListItemIcon>
    <ListItemText inset primary="Upload Image" />
  </MenuItem>
);

UploadMenuItem.propTypes = {
  replace: PropTypes.func.isRequired,
  hasValidToken: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};

const mapDispatchToProps = { replace };

const mapStateToProps = state => ({
  hasValidToken: authSelectors.getHasValidToken(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadMenuItem);
