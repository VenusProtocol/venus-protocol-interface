import type BigNumber from 'bignumber.js';
import { VError } from 'libs/errors';
import type { ChainId, Proposal, ProposalState } from 'types';
import { restService } from 'utilities';

import { formatToProposal } from './formatToProposal';
import type { GetApiProposalsResponse } from './types';

export interface GetProposalsInput {
  chainId: ChainId;
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
  accountAddress?: string;
  proposalState?: ProposalState;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetProposalsOutput {
  proposals: Proposal[];
  total: number;
}

export const getProposals = async ({
  currentBlockNumber,
  proposalMinQuorumVotesMantissa,
  page = 0,
  limit = 10,
  proposalState,
  search,
  accountAddress,
}: GetProposalsInput): Promise<GetProposalsOutput> => {
  const response = await restService<GetApiProposalsResponse>({
    endpoint: '/governance/proposals',
    method: 'GET',
    params: {
      state: proposalState,
      search: search ? encodeURIComponent(search) : undefined,
      limit,
      page,
    },
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  const proposals = payload.result.map(apiProposal =>
    formatToProposal({
      apiProposal,
      proposalMinQuorumVotesMantissa,
      currentBlockNumber,
      accountAddress,
    }),
  );

  return {
    proposals,
    total: payload.total,
  };
};
