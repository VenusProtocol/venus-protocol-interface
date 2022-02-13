import { connect } from 'react-redux';
import { accountActionCreators } from 'core/modules/account/actions';
import { State } from 'core/modules/initialState';

function mapStateToProps({ account }: State) {
  return {
    account,
  };
}

const mapDispatchToProps = accountActionCreators;

export function connectAccount(
  configMapStateToProps: ((state: State) => unknown) | null = mapStateToProps,
) {
  return connect(configMapStateToProps, mapDispatchToProps);
}
