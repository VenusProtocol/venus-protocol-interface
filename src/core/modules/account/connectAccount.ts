// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { connect } from 'react-redux';
import { accountActionCreators } from 'core/modules/account/actions';

function mapStateToProps({ account }: $TSFixMe) {
  return {
    account,
  };
}

const mapDispatchToProps = accountActionCreators;

export function connectAccount(configMapStateToProps = mapStateToProps) {
  return connect(configMapStateToProps, mapDispatchToProps);
}
