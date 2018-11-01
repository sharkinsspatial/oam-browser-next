/* global File */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { sendUpload } from '../actions/uploadActions';
import FormikTextField from './FormikTextField';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  grid: {
    marginTop: '20px'
  }
});

export const UploadForm = (props) => {
  const {
    classes,
    handleSubmit,
    setValues,
    values,
    ...formikFieldProps
  } = props;
  return (
    <Grid
      container
      justify="center"
      className={classes.grid}
    >
      <Grid item xs={8}>
        <form onSubmit={handleSubmit}>
          <FormikTextField
            name="email"
            type="email"
            label="Email"
            values={values}
            {...formikFieldProps}
          />
          <br />
          <FormikTextField
            name="password"
            type="password"
            label="Password"
            values={values}
            {...formikFieldProps}
          />
          <br />
          <br />
          <input
            name="file"
            accept="image/*"
            className={classes.input}
            id="raised-button-file"
            type="file"
            onChange={(event) => {
              const newValues = { ...values };
              // eslint-disable-next-line prefer-destructuring
              newValues[event.currentTarget.name] = event.currentTarget.files[0];
              setValues(newValues);
            }}
          />
          <label htmlFor="raised-button-file">
            <Button
              component="span"
              className={classes.button}
            >
              Upload
            </Button>
          </label>
          <br />
          <br />
          <Button
            className={classes.button}
            type="submit"
          >
             Submit
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address';
  }
  return errors;
};

const EnhancedUploadForm = withFormik({
  mapPropsToValues: () => ({ email: '', password: '' }),

  // Custom sync validation
  validate,

  handleSubmit: (values, { props, setSubmitting }) => {
    const { sendUpload: sendUploadAction } = props;
    const metadata = JSON.stringify(values, null, 2);
    delete metadata.file;
    const metadataFile = new File([metadata], 'metadata.json',
      { type: 'application/json' });
    sendUploadAction(metadataFile, values.file);
    setSubmitting(false);
  }
})(UploadForm);

UploadForm.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.string.isRequired,
    input: PropTypes.string.isRequired,
    grid: PropTypes.string.isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired
};

const mapDispatchToProps = { sendUpload };
export default withStyles(styles)(connect(null, mapDispatchToProps)(EnhancedUploadForm));
