import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  input: {
    display: 'none',
  },
  fileNameLabel: {
    display: 'inline-block',
    marginLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit
  }
});

const FormikFileSelect = (props) => {
  const {
    name,
    values,
    setValues,
    classes
  } = props;
  const file = getIn(values, name);
  return (
    <React.Fragment>
      <input
        name={name}
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
          variant="outlined"
          className={classes.button}
        >
          Select Local File
        </Button>
      </label>
      <Typography className={classes.fileNameLabel}>
        {file ? file.name : 'None selected'}
      </Typography>
    </React.Fragment>
  );
};

FormikFileSelect.propTypes = {
  name: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    input: PropTypes.string.isRequired,
    fileNameLabel: PropTypes.string.isRequired
  }).isRequired,
};
export default withStyles(styles)(FormikFileSelect);
