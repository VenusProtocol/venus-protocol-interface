import BigNumber from 'bignumber.js';

import formatVoterAccountResponse from 'clients/api/queries/getVoterAccounts/formatVoterAccountResponse';

import voterAccountsResponse from '../api/voterAccounts.json';

const voterAccounts = formatVoterAccountResponse({
  data: voterAccountsResponse,
  totalStakedXvs: voterAccountsResponse.result.reduce(
    (acc, va) => acc.plus(new BigNumber(va.votesMantissa)),
    new BigNumber(0),
  ),
});

export default voterAccounts;
