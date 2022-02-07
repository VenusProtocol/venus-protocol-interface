import { connect } from 'react-redux';
import { authActionCreators } from 'core/modules/auth/actions';

function mapStateToProps({ auth }: $TSFixMe) {
  return {
    auth,
  };
}

const mapDispatchToProps = authActionCreators;

export function connectAuth(configMapStateToProps = mapStateToProps) {
  return connect(configMapStateToProps, mapDispatchToProps);
}
