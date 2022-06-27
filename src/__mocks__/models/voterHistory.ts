import formatVoterHistoryResponse from 'clients/api/queries/getVoterHistory/formatVoterHistoryResponse';
import { IGetVoterHistoryResponse } from 'clients/api/queries/getVoterHistory/types';
import voterHistoryResponse from '../api/voterHistory.json';

const voterHistory = formatVoterHistoryResponse(
  voterHistoryResponse.data as IGetVoterHistoryResponse,
);

export default voterHistory;
