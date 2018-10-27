/* global File */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { sendUpload } from '../actions/uploadActions';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

const metadata = {
  provider: 'me',
  name: 'test'
};

const image = {
  image: true
};

const imageFile = new File([JSON.stringify(image)], 'image.json', { type: 'application/json' });
const metadataFile = new File([JSON.stringify(metadata)], 'metadata.json', { type: 'application/json' });

export const UploadForm = (props) => {
  const { sendUpload: sendUploadAction } = props;
  return (
    <Button
      onClick={() => { sendUploadAction(metadataFile, imageFile); }}
    >
      Upload
    </Button>
  );
};

UploadForm.propTypes = {
  sendUpload: PropTypes.func.isRequired
};

const mapDispatchToProps = { sendUpload };
export default withStyles(styles)(connect(null, mapDispatchToProps)(UploadForm));
