import formatVoterHistoryResponse from 'clients/api/queries/getVoterHistory/formatVoterHistoryResponse';

import voterHistoryResponse from '../api/voterHistory.json';

const voterHistory = formatVoterHistoryResponse(voterHistoryResponse);

export default voterHistory;
