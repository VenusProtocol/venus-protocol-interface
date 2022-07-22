import formatVoterDetailsResponse from 'clients/api/queries/getVoterDetails/formatVoterDetailsResponse';
import { GetVoterDetailsResponse } from 'clients/api/queries/getVoterDetails/types';
import { NULL_ADDRESS } from 'constants/address';

import voterDetailsResponse from '../api/voterDetails.json';

const voterDetails = formatVoterDetailsResponse(
  voterDetailsResponse.data as GetVoterDetailsResponse,
  NULL_ADDRESS,
);

export default voterDetails;
