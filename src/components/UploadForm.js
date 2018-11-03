import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';
import { sendUpload } from '../actions/uploadActions';
import FormikTextField from './FormikTextField';
import FormikFileSelect from './FormikFileSelect';
import FormikPlatformPicker from './FormikPlatformPicker';
import FormikDatePicker from './FormikDatePicker';
import TokenExpiredWarning from './TokenExpiredWarning';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit,
  },
  grid: {
    marginTop: '20px'
  },
  submit: {
    textAlign: 'center'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

export const UploadForm = (props) => {
  const {
    classes,
    handleSubmit,
    setValues,
    values,
    isValid,
    ...formikFieldProps
  } = props;
  return (
    <Grid
      container
      justify="center"
      className={classes.grid}
    >
      <Grid item xs={8}>
        <Paper className={classes.paper}>
          <Typography variant="h4">
            Upload Imagery
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormikTextField
              name="title"
              label="Title"
              values={values}
              {...formikFieldProps}
            />
            <br />
            <FormikTextField
              name="instrument"
              label="Instrument"
              values={values}
              helperText="Type or model of image sensor or camera used (ex: Worldview-3)."
              {...formikFieldProps}
            />
            <br />
            <FormikTextField
              name="provider"
              label="Provider"
              values={values}
              helperText="Name of company or individual that collected or provided the imagery."
              {...formikFieldProps}
            />
            <br />
            <FormikTextField
              name="tags"
              label="Tags"
              values={values}
              helperText="Comma seperated list of metadata tags"
              {...formikFieldProps}
            />
            <br />
            <br />
            <FormLabel component="legend">
              Platform
            </FormLabel>
            <FormikPlatformPicker
              name="platform"
              values={values}
              {...formikFieldProps}
            />
            <br />
            <FormLabel component="legend">
              Date Range
            </FormLabel>
            <FormikDatePicker
              name="startdatetime"
              label="Start Date"
              values={values}
              {...formikFieldProps}
            />
            <FormikDatePicker
              name="enddatetime"
              label="End Date"
              values={values}
              {...formikFieldProps}
            />
            <br />
            <br />
            <FormLabel component="legend">
              Imagery Location
            </FormLabel>
            <FormikFileSelect
              name="file"
              values={values}
              setValues={setValues}
            />
            <br />
            <br />
            <Paper className={classes.paper}>
              <Typography variant="body2" gutterBottom>
                By submitting imagery to OpenAerialMap, you agree to place
                your imagery into the
                {' '}
                <a href="https://github.com/openimagerynetwork/oin-register#open-imagery-network">
                 Open Imagery Network (OIN).
                </a>
                {'  '}
                All imagery contained in OIN is licensed
                {' '}
                <a href="https://creativecommons.org/licenses/by/4.0/">
                  CC-BY 4.0
                </a>
                ,
                with attribution as contributors of OIN.  All imagery is
                available for tracing in OpenStreetMap.
              </Typography>
            </Paper>
            <div className={classes.submit}>
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isValid}
              >
                Submit Upload
                <CloudUploadIcon className={classes.rightIcon} />
              </Button>
            </div>
          </form>
        </Paper>
      </Grid>
      <TokenExpiredWarning />
    </Grid>
  );
};

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg'];
const UploadSchema = Yup.object().shape({
  title: Yup.string()
    .required('A title is required'),
  instrument: Yup.string()
    .required('An instrument is required'),
  file: Yup.mixed()
    .required('A file is required')
    .test(
      'fileFormat',
      'Unsupported Format',
      value => value && SUPPORTED_FORMATS.includes(value.type)
    ),
  startdatetime: Yup.date()
    .required('A start date is required'),
  enddatetime: Yup.date()
    .required('An end date is required'),
  provider: Yup.string()
    .required('A provider is required'),
  tags: Yup.string()
    .matches(/^\w(\s*,?\s*\w)*$/,
      {
        message: 'Must be a comma separated list',
        excludeEmptyString: true
      })
});

const EnhancedUploadForm = withFormik({
  mapPropsToValues: () => ({
    title: '',
    instrument: '',
    provider: '',
    tags: '',
    platform: 'satellite',
    startdatetime: new Date().toISOString().substring(0, 10),
    enddatetime: new Date().toISOString().substring(0, 10)
  }),

  validationSchema: UploadSchema,

  handleSubmit: (values, { props, setSubmitting }) => {
    const { sendUpload: sendUploadAction } = props;
    sendUploadAction(values);
    setSubmitting(false);
  }
})(UploadForm);

UploadForm.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.string.isRequired,
    grid: PropTypes.string.isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  isValid: PropTypes.bool.isRequired
};

const mapDispatchToProps = { sendUpload };
export default withStyles(styles)(connect(null, mapDispatchToProps)(EnhancedUploadForm));
