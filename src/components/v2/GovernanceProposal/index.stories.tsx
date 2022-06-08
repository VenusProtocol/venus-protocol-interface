import React from 'react';
import { BigNumber } from 'bignumber.js';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { GovernanceProposal } from '.';

export default {
  title: 'Components/GovernanceProposal',
  decorators: [withThemeProvider, withCenterStory({ width: 750 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
};

export const Active = () => (
  <GovernanceProposal
    proposalNumber={58}
    proposalDescription="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Active"
    forVotesWei={new BigNumber('500000000000000000')}
    againstVotesWei={new BigNumber('2000000000000000000')}
    abstainedVotesWei={new BigNumber('0')}
    endDate={new Date(Date.now() + 3650000)}
  />
);
export const Queued = () => (
  <GovernanceProposal
    proposalNumber={58}
    proposalDescription="Buy back and burn and Tokenomic contribution finished soon with very very very very very very very very very very very very very very very very long text example"
    proposalState="Queued"
    endDate={new Date(Date.now() + 3650000)}
  />
);
export const ReadyToExecute = () => (
  <GovernanceProposal
    proposalNumber={58}
    proposalDescription="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Pending"
    endDate={new Date(Date.now() + 3650000)}
  />
);
export const Executed = () => (
  <GovernanceProposal
    proposalNumber={58}
    proposalDescription="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Executed"
    endDate={new Date(Date.now() + 3650000)}
  />
);
export const Cancelled = () => (
  <GovernanceProposal
    proposalNumber={58}
    proposalDescription="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Canceled"
    endDate={new Date(Date.now())}
  />
);
