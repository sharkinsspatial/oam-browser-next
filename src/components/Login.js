/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Facebook from './Facebook';
import { setToken, getToken } from '../utils/tokens';
import { setHasValidToken } from '../actions/authActions';
import * as authSelectors from '../reducers/authSelectors';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const { setHasValidToken: setValidToken } = this.props;
    const key = process.env.REACT_APP_ACCESS_TOKEN_KEY;
    window.addEventListener('message', (e) => {
      if (e.data[key]) {
        setToken(e.data[key]);
        setValidToken(true);
      }
    });
    const token = getToken();
    if (token) {
      setValidToken(true);
    }
  }

  handleClick(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  handleClose() {
    this.setState({
      anchorEl: null,
    });
  }

  render() {
    let { anchorEl } = this.state;
    const { hasValidToken } = this.props;
    // Close popup if user has token
    let buttonText = 'Login';
    if (hasValidToken) {
      anchorEl = null;
      buttonText = 'Logged In';
    }
    return (
      <div>
        <Button disabled={hasValidToken} onClick={this.handleClick}>
          {buttonText}
        </Button>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Facebook />
        </Popover>
      </div>
    );
  }
}

Login.propTypes = {
  hasValidToken: PropTypes.bool.isRequired,
  setHasValidToken: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  hasValidToken: authSelectors.getHasValidToken(state)
});

const mapDispatchToProps = { setHasValidToken };
export default connect(mapStateToProps, mapDispatchToProps)(Login);
