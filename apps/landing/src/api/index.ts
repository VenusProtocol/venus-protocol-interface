import axios from 'axios';
import type { ProposalsResponseData, TvlResponseData } from './types';
import { formatTvlData } from './utils';

const apiBaseUrl = 'https://api.venus.io/';

const proposalsRequestUrl = `${apiBaseUrl}governance/proposals?limit=1`;
const tvlRequestUrl = `${apiBaseUrl}markets/tvl`;

export async function fetchProposalCount() {
  const { data: response }: { data: ProposalsResponseData } = await axios.get(proposalsRequestUrl);
  return response.total;
}

export async function fetchTvl() {
  const { data: response }: { data: TvlResponseData } = await axios.get(tvlRequestUrl);
  return formatTvlData(response);
}
