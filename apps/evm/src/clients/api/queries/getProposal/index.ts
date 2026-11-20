import type BigNumber from 'bignumber.js';
import { VError } from 'libs/errors';
import type { ChainId, Proposal } from 'types';
import { restService } from 'utilities';

import { formatToProposal } from '../getProposals/formatToProposal';
import type { ApiProposal } from '../getProposals/types';

export interface GetProposalInput {
  proposalId: number;
  chainId: ChainId;
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
  accountAddress?: string;
}

export type GetProposalOutput = {
  proposal?: Proposal;
};

export const getProposal = async ({
  proposalId,
  currentBlockNumber,
  proposalMinQuorumVotesMantissa,
  accountAddress,
}: GetProposalInput): Promise<GetProposalOutput> => {
  const response = await restService<ApiProposal>({
    endpoint: `/governance/proposals/${proposalId}`,
    method: 'GET',
  });

  const payload = response.data;

  if (response.status === 404) {
    throw new VError({
      type: 'proposal',
      code: 'proposalNotFound',
    });
  }

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

  const proposal = formatToProposal({
    apiProposal: payload,
    proposalMinQuorumVotesMantissa,
    currentBlockNumber,
    accountAddress,
  });

  return { proposal };
};
