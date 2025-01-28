import formatToVoters from 'clients/api/queries/getVoters/formatToVoters';

import type { GetVotersApiResponse } from 'clients/api';
import votersResponse from '../api/voters.json';

const voters = formatToVoters({ payload: votersResponse as GetVotersApiResponse });

export default voters;
