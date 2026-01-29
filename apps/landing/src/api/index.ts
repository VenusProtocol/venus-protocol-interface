import axios from 'axios';
import type { MarketsResponseData, ProposalsResponseData, TvlResponseData } from './types';
import { formatTvlData, mapMarketsData } from './utils';

const apiBaseUrl = 'https://api.venus.io/';

const marketsRequestUrl = `${apiBaseUrl}markets/core-pool?limit=500`;
const proposalsRequestUrl = `${apiBaseUrl}governance/proposals?limit=1`;
const tvlRequestUrl = `${apiBaseUrl}markets/tvl`;

export async function fetchMarkets() {
  const { data: response }: { data: MarketsResponseData } = await axios.get(marketsRequestUrl);
  return mapMarketsData(response.result);
}

export async function getProposalCount() {
  const { data: response }: { data: ProposalsResponseData } = await axios.get(proposalsRequestUrl);
  return response.total;
}

export async function fetchTvl() {
  const { data: response }: { data: TvlResponseData } = await axios.get(tvlRequestUrl);
  return formatTvlData(response);
}
