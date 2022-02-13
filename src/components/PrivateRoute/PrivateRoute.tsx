import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connectAuth } from 'core';
import { State } from 'core/modules/initialState';

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
  user: PropTypes.object,
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultProps' does not exist on type 'ty... Remove this comment to see the full error message
PrivateRoute.defaultProps = {
  user: PropTypes.object,
};

const mapStateToProps = ({ auth }: State) => ({
  user: auth.user,
});

export default connectAuth(mapStateToProps)(PrivateRoute);
