import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { getHasValidToken } from '../reducers/authSelectors';

const TokenExpiredWarning = (props) => {
  const { hasValidToken } = props;
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={!hasValidToken}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={(
        <span id="message-id">
          Your session has expired.  Please Login again.
        </span>
      )}
    />
  );
};

TokenExpiredWarning.propTypes = {
  hasValidToken: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  hasValidToken: getHasValidToken(state)
});

export default connect(mapStateToProps, null)(TokenExpiredWarning);
