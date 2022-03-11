import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connectAuth } from 'core';
import { User } from 'types';
import { State } from 'core/modules/initialState';

interface PrivateRouteProps {
  user?: User;
}

class PrivateRoute extends React.PureComponent<PrivateRouteProps> {
  render() {
    const { user, ...props } = this.props;
    if (user && user.Token) {
      return <Route {...props} />;
    }
    return <Redirect to="/" />;
  }
}

const mapStateToProps = ({ auth }: State) => ({
  user: auth.user,
});

export default connectAuth(mapStateToProps)(PrivateRoute);
