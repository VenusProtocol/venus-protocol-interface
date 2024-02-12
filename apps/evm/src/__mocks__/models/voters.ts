import formatToVoters from 'clients/api/queries/getVoters/formatToVoters';

import votersResponse from '../api/voters.json';

const voters = formatToVoters({ payload: votersResponse });

export default voters;
