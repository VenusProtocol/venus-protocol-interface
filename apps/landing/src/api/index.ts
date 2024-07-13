import axios from 'axios';
import type { MarketsResponseData, ProposalsResponseData } from './types';
import { mapMarketsData } from './utils';

const marketsRequestUrl = 'https://api.venus.io/markets/core-pool?limit=999999';
const proposalsRequestUrl = 'https://api.venus.io/governance/proposals?limit=1';

export async function fetchMarkets() {
  const { data: response }: { data: MarketsResponseData } = await axios.get(marketsRequestUrl);
  return mapMarketsData(response.result);
}

export async function fetchProposalCount() {
  const { data: response }: { data: ProposalsResponseData } = await axios.get(proposalsRequestUrl);
  return response.total;
}
