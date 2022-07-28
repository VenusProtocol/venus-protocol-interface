import formatVoterHistoryResponse from 'clients/api/queries/getVoterHistory/formatVoterHistoryResponse';
import { GetVoterHistoryResponse } from 'clients/api/queries/getVoterHistory/types';

import voterHistoryResponse from '../api/voterHistory.json';

const voterHistory = formatVoterHistoryResponse(
  voterHistoryResponse.data as GetVoterHistoryResponse,
);

export default voterHistory;
