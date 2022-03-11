import { connect } from 'react-redux';
import { authActionCreators } from 'core/modules/auth/actions';
import { State } from 'core/modules/initialState';

function mapStateToProps({ auth }: $TSFixMe) {
  return {
    auth,
  };
}

const mapDispatchToProps = authActionCreators;

export function connectAuth(
  configMapStateToProps: ((state: State) => unknown) | null = mapStateToProps,
) {
  return connect(configMapStateToProps, mapDispatchToProps);
}
