import { BigNumber } from 'bignumber.js';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import VoteProposal from '.';

export default {
  title: 'Components/VoteProposal',
  decorators: [withThemeProvider, withCenterStory({ width: 750 })],
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
    proposalState="Active"
    forVotesWei={new BigNumber('500000000000000000')}
    againstVotesWei={new BigNumber('2000000000000000000')}
    abstainedVotesWei={new BigNumber('0')}
    endDate={new Date(1678859525000)}
    createdDate={new Date(1678859525000)}
    cancelDate={undefined}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);
export const Queued = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon with very very very very very very very very very very very very very very very very long text example"
    proposalState="Queued"
    endDate={new Date(1678859525000)}
    createdDate={new Date(1678859525000)}
    cancelDate={undefined}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);
export const Pending = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Pending"
    endDate={new Date(1678859525000)}
    createdDate={new Date(1678859525000)}
    cancelDate={undefined}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);
export const Executed = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Executed"
    endDate={new Date(1678859525000)}
    createdDate={new Date(1678859525000)}
    cancelDate={undefined}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);
export const Cancelled = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Canceled"
    endDate={new Date(1678859525000)}
    createdDate={new Date(1678859525000)}
    cancelDate={undefined}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);

export const Defeated = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Defeated"
    endDate={new Date(1678859525000)}
    createdDate={new Date(1678859525000)}
    cancelDate={undefined}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);

export const Succeeded = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Succeeded"
    endDate={new Date(1678859525000)}
    createdDate={new Date(1678859525000)}
    cancelDate={undefined}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);

export const Expired = () => (
  <VoteProposal
    proposalNumber={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Expired"
    endDate={new Date(1678859525000)}
    createdDate={new Date(1678859525000)}
    cancelDate={undefined}
    queuedDate={new Date(1678899525000)}
    executedDate={new Date(1698859525000)}
  />
);
