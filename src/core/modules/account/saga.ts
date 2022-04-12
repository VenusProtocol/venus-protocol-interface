/* eslint-disable no-unused-vars */
import { put, call, fork, all, take } from 'redux-saga/effects';

import {
  GET_MARKET_HISTORY_REQUEST,
  GET_PROPOSALS_REQUEST,
  GET_FAUCET_REQUEST,
  GET_GOVERNANCE_VENUS_REQUEST,
  GET_PROPOSAL_BY_ID_REQUEST,
  GET_VOTERS_REQUEST,
  GET_VOTER_DETAIL_REQUEST,
  GET_VOTER_HISTORY_REQUEST,
  GET_VOTER_ACCOUNTS_REQUEST,
  GET_TRANSACTION_HISTORY_REQUEST,
  accountActionCreators,
} from 'core/modules/account/actions';

import { restService } from 'utilities';

export function* asyncGetMarketHistoryRequest({ payload, resolve, reject }: $TSFixMe) {
  const { asset, limit, type } = payload;
  let endpoint = `/market_history/graph?asset=${asset}&type=${type}`;
  if (limit) endpoint += `&limit=${limit}`;
  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint,
      method: 'GET',
      params: {},
    });
    if (response.status === 200) {
      resolve(response.data);
    }
  } catch (e) {
    reject(e);
  }
}

export function* asyncGetGovernanceVenusRequest({ resolve, reject }: $TSFixMe) {
  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint: '/governance/venus',
      method: 'GET',
      params: {},
    });
    if (response.status === 200) {
      resolve(response.data);
    }
  } catch (e) {
    reject(e);
  }
}

export function* asyncGetProposalsRequest({ payload, resolve, reject }: $TSFixMe) {
  const { limit, offset } = payload;
  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint: `/proposals?limit=${limit || 5}&offset=${offset || 0}`,
      method: 'GET',
      params: {},
    });
    if (response.status === 200) {
      resolve(response.data);
    } else {
      reject(response);
    }
  } catch (e) {
    reject(e);
  }
}

export function* asyncGetFaucetRequest({ payload, resolve, reject }: $TSFixMe) {
  const { address, asset, amountType } = payload;

  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint: '/faucet',
      method: 'POST',
      params: {
        address,
        asset,
        amountType,
      },
    });
    if (response.status === 200) {
      yield put(accountActionCreators.getFromFaucetSuccess());
      resolve(response.data);
    } else {
      reject(response);
    }
  } catch (e) {
    reject(e);
  }
}

export function* asyncGetProposalByIdRequest({ payload, resolve, reject }: $TSFixMe) {
  const { id } = payload;
  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint: `/proposals/${id}`,
      method: 'GET',
      params: {},
    });
    if (response.status === 200) {
      resolve(response.data);
    } else {
      reject(response);
    }
  } catch (e) {
    reject(e);
  }
}

export function* asyncGetVotersRequest({ payload, resolve, reject }: $TSFixMe) {
  const { limit, filter, id, offset } = payload;
  try {
    let endpoint = `/voters/${id}?filter=${filter}`;
    if (limit) {
      endpoint += `&limit=${limit}`;
    }
    if (offset) {
      endpoint += `&offset=${offset}`;
    }
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint,
      method: 'GET',
      params: {},
    });
    if (response.status === 200) {
      resolve(response.data);
    } else {
      reject(response);
    }
  } catch (e) {
    reject(e);
  }
}
export function* asyncGetVoterDetailRequest({ payload, resolve, reject }: $TSFixMe) {
  const { address } = payload;
  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint: `/voters/accounts/${address}`,
      method: 'GET',
      params: {},
    });
    if (response.status === 200) {
      resolve(response.data);
    } else {
      reject(response);
    }
  } catch (e) {
    reject(e);
  }
}
export function* asyncGetVoterHistoryRequest({ payload, resolve, reject }: $TSFixMe) {
  const { offset, limit, address } = payload;
  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint: `/voters/history/${address}?offset=${offset || 0}&limit=${limit || 5}`,
      method: 'GET',
      params: {},
    });
    if (response.status === 200) {
      resolve(response.data);
    } else {
      reject(response);
    }
  } catch (e) {
    reject(e);
  }
}
export function* asyncGetVoterAccountsRequest({ payload, resolve, reject }: $TSFixMe) {
  const { limit, offset } = payload;

  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint: `/voters/accounts?limit=${limit || 100}&offset=${offset || 0}`,
      method: 'GET',
      params: {},
    });
    if (response.status === 200) {
      resolve(response.data);
    }
  } catch (e) {
    reject(e);
  }
}
export function* asyncGetTransactionHistoryRequest({ payload, resolve, reject }: $TSFixMe) {
  const { offset, event } = payload;
  try {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const response = yield call(restService, {
      endpoint: `/transactions?page=${offset || 0}${event !== 'All' ? `&event=${event}` : ''}`,
      method: 'GET',
      params: {},
    });
    if (response.status === 200) {
      resolve(response.data);
    } else {
      reject(response);
    }
  } catch (e) {
    reject(e);
  }
}

export function* watchGetMarketHistoryRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(GET_MARKET_HISTORY_REQUEST);
    yield* asyncGetMarketHistoryRequest(action);
  }
}

export function* watchGetGovernanceVenusRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(GET_GOVERNANCE_VENUS_REQUEST);
    yield* asyncGetGovernanceVenusRequest(action);
  }
}

export function* watchGetProposalsRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(GET_PROPOSALS_REQUEST);
    yield* asyncGetProposalsRequest(action);
  }
}
export function* watchGetFaucetRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(GET_FAUCET_REQUEST);
    yield* asyncGetFaucetRequest(action);
  }
}
export function* watchGetProposalByIdRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(GET_PROPOSAL_BY_ID_REQUEST);
    yield* asyncGetProposalByIdRequest(action);
  }
}
export function* watchGetVotersRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(GET_VOTERS_REQUEST);
    yield* asyncGetVotersRequest(action);
  }
}
export function* watchGetVoterDetailRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(GET_VOTER_DETAIL_REQUEST);
    yield* asyncGetVoterDetailRequest(action);
  }
}
export function* watchGetVoterHistoryRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(GET_VOTER_HISTORY_REQUEST);
    yield* asyncGetVoterHistoryRequest(action);
  }
}
export function* watchGetVoterAccountsRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(GET_VOTER_ACCOUNTS_REQUEST);
    yield* asyncGetVoterAccountsRequest(action);
  }
}
export function* watchGetTransactionHistoryRequest() {
  while (true) {
    // @ts-expect-error ts-migrate(7057) FIXME: 'yield' expression implicitly results in an 'any' ... Remove this comment to see the full error message
    const action = yield take(GET_TRANSACTION_HISTORY_REQUEST);
    yield* asyncGetTransactionHistoryRequest(action);
  }
}

export default function* saga() {
  yield all([
    fork(watchGetMarketHistoryRequest),
    fork(watchGetGovernanceVenusRequest),
    fork(watchGetFaucetRequest),
    fork(watchGetProposalsRequest),
    fork(watchGetProposalByIdRequest),
    fork(watchGetVotersRequest),
    fork(watchGetVoterDetailRequest),
    fork(watchGetVoterHistoryRequest),
    fork(watchGetVoterAccountsRequest),
    fork(watchGetTransactionHistoryRequest),
  ]);
}
