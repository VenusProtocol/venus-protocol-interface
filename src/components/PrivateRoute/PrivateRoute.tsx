import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Route, Redirect } from 'react-router-dom';
import { connectAuth } from 'core';

class PrivateRoute extends React.PureComponent {
  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { user, ...props } = this.props;
    if (user && user.Token) {
      return <Route {...props} />;
    }
    return <Redirect to="/" />;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
PrivateRoute.propTypes = {
  user: PropTypes.object
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultProps' does not exist on type 'ty... Remove this comment to see the full error message
PrivateRoute.defaultProps = {
  user: PropTypes.object
};


const mapStateToProps = ({ auth }: $TSFixMe) => ({
  user: auth.user
});
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0-1 arguments, but got 2.
export default connectAuth(mapStateToProps, {})(PrivateRoute);
