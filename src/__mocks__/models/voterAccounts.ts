import formatVoterAccountResponse from 'clients/api/queries/getVoterAccounts/formatVoterAccountResponse';

import voterAccountsResponse from '../api/voterAccounts.json';

const voterAccounts = formatVoterAccountResponse(voterAccountsResponse.data);

export default voterAccounts;
