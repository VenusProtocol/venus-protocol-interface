// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { connect } from 'react-redux';
import { authActionCreators } from 'core/modules/auth/actions';

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
function mapStateToProps({ auth }: $TSFixMe) {
  return {
    auth
  };
}

const mapDispatchToProps = authActionCreators;

export function connectAuth(configMapStateToProps = mapStateToProps) {
  return connect(configMapStateToProps, mapDispatchToProps);
}
