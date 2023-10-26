import { BigNumber } from 'bignumber.js';
import React from 'react';
import { ProposalState } from 'types';

import { withCenterStory, withRouter, withThemeProvider } from 'stories/decorators';

import VoteProposal from '.';

export default {
  title: 'Components/VoteProposal',
  decorators: [withThemeProvider, withRouter, withCenterStory({ width: 750 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
};

export const Active = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Active}
    forVotesMantissa={new BigNumber('500000000000000000')}
    againstVotesMantissa={new BigNumber('2000000000000000000')}
    abstainedVotesMantissa={new BigNumber('0')}
    endDate={new Date(1678859525000)}
    cancelDate={undefined}
    createdDate={new Date(1658899525000)}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);
export const Queued = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon with very very very very very very very very very very very very very very very very long text example"
    proposalState={ProposalState.Queued}
    endDate={new Date(1678859525000)}
    cancelDate={undefined}
    createdDate={new Date(1658899525000)}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);
export const Pending = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Pending}
    endDate={new Date(1678859525000)}
    cancelDate={undefined}
    createdDate={new Date(1658899525000)}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);
export const Executed = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Executed}
    endDate={new Date(1678859525000)}
    cancelDate={undefined}
    createdDate={new Date(1658899525000)}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);
export const Cancelled = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Canceled}
    endDate={new Date(1678859525000)}
    cancelDate={undefined}
    createdDate={new Date(1658899525000)}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);

export const Defeated = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Defeated}
    endDate={new Date(1678859525000)}
    cancelDate={undefined}
    createdDate={new Date(1658899525000)}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);

export const Succeeded = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Succeeded}
    endDate={new Date(1678859525000)}
    cancelDate={undefined}
    createdDate={new Date(1658899525000)}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);

export const Expired = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Expired}
    endDate={new Date(1678859525000)}
    cancelDate={undefined}
    createdDate={new Date(1658899525000)}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);
