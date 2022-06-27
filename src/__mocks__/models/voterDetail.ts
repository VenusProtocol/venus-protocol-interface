import formatVoterDetailResponse from 'clients/api/queries/getVoterDetail/formatVoterDetailResponse';
import { IGetVoterDetailResponse } from 'clients/api/queries/getVoterDetail/types';
import { NULL_ADDRESS } from 'constants/address';
import voterDetailResponse from '../api/voterDetail.json';

const voterDetail = formatVoterDetailResponse(
  voterDetailResponse.data as IGetVoterDetailResponse,
  NULL_ADDRESS,
);

export default voterDetail;
