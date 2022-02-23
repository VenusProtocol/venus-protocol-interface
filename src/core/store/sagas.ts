import { fork, all } from 'redux-saga/effects';
import { authSaga, accountSaga } from 'core/modules';

export default function* rootSaga() {
  yield all([fork(authSaga), fork(accountSaga)]);
}
