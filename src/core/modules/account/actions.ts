import { createAction } from 'redux-actions';
import { createPromiseAction } from 'core/modules/utils';

/**
 * Action Types
 */
export const SET_SETTING_REQUEST = '@account/SET_SETTING_REQUEST';
export const GET_MARKET_HISTORY_REQUEST = '@account/GET_MARKET_HISTORY_REQUEST';
export const GET_GOVERNANCE_VENUS_REQUEST = '@account/GET_GOVERNANCE_VENUS_REQUEST';
export const GET_PROPOSALS_REQUEST = '@account/GET_PROPOSALS_REQUEST';

export const GET_FAUCET_REQUEST = '@account/GET_FAUCET_REQUEST';
export const GET_FAUCET_SUCCESS = '@account/GET_FAUCET_SUCCESS';
export const GET_FAUCET_FAILURE = '@account/GET_FAUCET_FAILURE';

export const GET_PROPOSAL_BY_ID_REQUEST = '@account/GET_PROPOSAL_BY_ID_REQUEST';

export const GET_VOTERS_REQUEST = '@account/GET_VOTERS_REQUEST';

export const GET_VOTER_DETAIL_REQUEST = '@account/GET_VOTER_DETAIL_REQUEST';

export const GET_VOTER_HISTORY_REQUEST = '@account/GET_VOTER_HISTORY_REQUEST';

export const GET_VOTER_ACCOUNTS_REQUEST = '@account/GET_VOTER_ACCOUNTS_REQUEST';
export const GET_TRANSACTION_HISTORY_REQUEST = '@account/GET_TRANSACTION_HISTORY_REQUEST';

/**
 * Action Creators
 */
export const accountActionCreators = {
  setSetting: createAction(SET_SETTING_REQUEST),
  getMarketHistory: createPromiseAction(GET_MARKET_HISTORY_REQUEST),
  getGovernanceVenus: createPromiseAction(GET_GOVERNANCE_VENUS_REQUEST),

  getProposals: createPromiseAction(GET_PROPOSALS_REQUEST),
  getFromFaucet: createPromiseAction(GET_FAUCET_REQUEST),
  getFromFaucetSuccess: createAction(GET_FAUCET_SUCCESS),
  getFromFaucetFailure: createAction(GET_FAUCET_FAILURE),
  getProposalById: createPromiseAction(GET_PROPOSAL_BY_ID_REQUEST),
  getVoters: createPromiseAction(GET_VOTERS_REQUEST),
  getVoterDetail: createPromiseAction(GET_VOTER_DETAIL_REQUEST),
  getVoterHistory: createPromiseAction(GET_VOTER_HISTORY_REQUEST),
  getVoterAccounts: createPromiseAction(GET_VOTER_ACCOUNTS_REQUEST),
  getTransactionHistory: createPromiseAction(GET_TRANSACTION_HISTORY_REQUEST),
};
