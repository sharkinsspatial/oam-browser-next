import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { getIn } from 'formik';

const styles = theme => ({
  textField: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

const FormikDatePicker = (props) => {
  const {
    name,
    classes,
    handleChange,
    values,
    label
  } = props;

  const value = getIn(values, name);

  return (
    <TextField
      label={label}
      type="datetime-local"
      onChange={handleChange}
      defaultValue={value}
      className={classes.textField}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};

FormikDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired
};

export default withStyles(styles)(FormikDatePicker);
