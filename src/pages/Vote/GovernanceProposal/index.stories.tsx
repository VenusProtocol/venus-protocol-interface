import { BigNumber } from 'bignumber.js';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import GovernanceProposal from '.';

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
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Active"
    forVotesWei={new BigNumber('500000000000000000')}
    againstVotesWei={new BigNumber('2000000000000000000')}
    abstainedVotesWei={new BigNumber('0')}
    endDate={new Date(Date.now() + 3650000)}
  />
);
export const Queued = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon with very very very very very very very very very very very very very very very very long text example"
    proposalState="Queued"
    endDate={new Date()}
  />
);
export const Pending = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Pending"
    endDate={new Date()}
  />
);
export const Executed = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Executed"
    endDate={new Date()}
  />
);
export const Cancelled = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Canceled"
    endDate={new Date(Date.now())}
  />
);

export const Defeated = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Defeated"
    endDate={new Date(Date.now())}
  />
);

export const Succeeded = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Succeeded"
    endDate={new Date(Date.now())}
  />
);

export const Expired = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Expired"
    endDate={new Date(Date.now())}
  />
);
