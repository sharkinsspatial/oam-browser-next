import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getIn } from 'formik';

const FormikPlatformPicker = (props) => {
  const {
    handleChange,
    name,
    values
  } = props;

  const value = getIn(values, name);

  return (
    <RadioGroup
      aria-label="platform"
      name="platform"
      value={value}
      onChange={handleChange}
      row
    >
      <FormControlLabel
        value="satellite"
        control={<Radio color="primary" />}
        label="Satellite"
        labelPlacement="start"
      />
      <FormControlLabel
        value="aircraft"
        control={<Radio color="primary" />}
        label="Aircraft"
        labelPlacement="start"
      />
      <FormControlLabel
        value="uav"
        control={<Radio color="primary" />}
        label="UAV"
        labelPlacement="start"
      />
      <FormControlLabel
        value="baloon"
        control={<Radio color="primary" />}
        label="Baloon"
        labelPlacement="start"
      />
      <FormControlLabel
        value="kite"
        control={<Radio color="primary" />}
        label="Kite"
        labelPlacement="start"
      />
    </RadioGroup>
  );
};

FormikPlatformPicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired
};
export default FormikPlatformPicker;
