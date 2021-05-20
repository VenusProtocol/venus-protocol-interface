import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connectAuth } from 'core';

class PrivateRoute extends React.PureComponent {
  render() {
    const { user, ...props } = this.props;
    if (user && user.Token) {
      return <Route {...props} />;
    }
    return <Redirect to="/" />;
  }
}

PrivateRoute.propTypes = {
  user: PropTypes.object
};

PrivateRoute.defaultProps = {
  user: PropTypes.object
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user
});
export default connectAuth(mapStateToProps, {})(PrivateRoute);
