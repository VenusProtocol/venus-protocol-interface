import formatVoterDetailsResponse from 'clients/api/queries/getVoterDetails/formatVoterDetailsResponse';
import { NULL_ADDRESS } from 'constants/address';

import voterDetailsResponse from '../api/voterDetails.json';

const voterDetails = formatVoterDetailsResponse(voterDetailsResponse, NULL_ADDRESS);

export default voterDetails;
