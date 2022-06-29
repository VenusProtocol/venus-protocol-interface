import formatToVoter from 'clients/api/queries/getVoters/formatToVoter';
import { IGetVotersApiResponse } from 'clients/api/queries/getVoters';
import voteResponse from '../api/vote.json';

const votes = formatToVoter(voteResponse.data as IGetVotersApiResponse);

export default votes;
