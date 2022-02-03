import { connect } from 'react-redux';
import { accountActionCreators } from 'core/modules/account/actions';

function mapStateToProps({ account }) {
  return {
    account
  };
}

const mapDispatchToProps = accountActionCreators;

export function connectAccount(configMapStateToProps = mapStateToProps) {
  return connect(configMapStateToProps, mapDispatchToProps);
}
