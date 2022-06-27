import formatVoterDetailResponse from 'clients/api/queries/getVoterDetail/formatVoterDetailResponse';
import { IGetVoterDetailResponse } from 'clients/api/queries/getVoterDetail/types';
import voterDetailResponse from '../api/voterDetail.json';

const voterDetail = formatVoterDetailResponse(voterDetailResponse.data as IGetVoterDetailResponse);

export default voterDetail;
