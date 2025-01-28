import formatVoterHistoryResponse from 'clients/api/queries/getVoterHistory/formatVoterHistoryResponse';

import type { GetVoterHistoryResponse } from 'clients/api/queries/getVoterHistory/types';
import voterHistoryResponse from '../api/voterHistory.json';

const voterHistory = formatVoterHistoryResponse(voterHistoryResponse as GetVoterHistoryResponse);

export default voterHistory;
