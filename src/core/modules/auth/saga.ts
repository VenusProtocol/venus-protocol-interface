/* eslint-disable no-unused-vars */
import { put, call, fork, all, take } from 'redux-saga/effects';

import {
  HANDLE_AUTH_ERROR_REQUEST,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  authActionCreators,
} from 'core/modules/auth/actions';

import { restService } from 'utilities';

export function* handleAuthErrorRequest({ payload }: $TSFixMe) {
  const { response } = payload;
  try {
    if (response.data && response.status === 401) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
      yield put(authActionCreators.logOut({}));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('e', e);
  }
}

export function* asyncLoginRequest({ payload, resolve, reject }: $TSFixMe) {
  const { email, password } = payload;

  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint: '',
      method: 'POST',
      params: {
        Username: email,
        Password: password,
      },
    });
    if (response.status === 200) {
      yield put(authActionCreators.loginSuccess({ user: response.data }));
      resolve(response.data);
    } else {
      reject(response);
    }
  } catch (e) {
    reject(e);
  }
}

export function* asyncRegisterRequest({ payload, resolve, reject }: $TSFixMe) {
  const { email, password } = payload;

  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint: '',
      method: 'POST',
      params: {
        username: email,
        password,
      },
    });
    if (response.status === 200) {
      yield put(authActionCreators.registerSuccess({ user: response.data }));
      resolve(response.data);
    } else {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
      yield put(authActionCreators.handleAuthError({ response }));
      reject(response);
    }
  } catch (e) {
    reject(e);
  }
}

export function* asyncLogoutRequest({ reject }: $TSFixMe) {
  try {
    // const response = yield call(restService, {
    //   api: `/auth/logout`,
    //   method: 'PUT',
    //   params: {}
    // });

    // if (response.status === 200) {
    yield put(authActionCreators.logOutSuccess());
    // }
  } catch (e) {
    reject(e);
  }
}

export function* watchHandleAuthErrorRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(HANDLE_AUTH_ERROR_REQUEST);
    yield* handleAuthErrorRequest(action);
  }
}
export function* watchLoginRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(LOGIN_REQUEST);
    yield* asyncLoginRequest(action);
  }
}
export function* watchRegisterRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(REGISTER_REQUEST);
    yield* asyncRegisterRequest(action);
  }
}
export function* watchLogoutRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(LOGOUT_REQUEST);
    yield* asyncLogoutRequest(action);
  }
}

// prettier-ignore
export default function* () {
  yield all([
    fork(watchHandleAuthErrorRequest),
    fork(watchLoginRequest),
    fork(watchRegisterRequest),
    fork(watchLogoutRequest),
  ]);
}
