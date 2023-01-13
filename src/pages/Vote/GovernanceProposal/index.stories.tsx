import { BigNumber } from 'bignumber.js';
import React from 'react';
import { ProposalType } from 'types';

import { withCenterStory, withRouter, withThemeProvider } from 'stories/decorators';

import GovernanceProposal from '.';

export default {
  title: 'Components/GovernanceProposal',
  decorators: [withThemeProvider, withCenterStory({ width: 750 }), withRouter],
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
    cancelDate={undefined}
    endDate={new Date(Date.now() + 3650000)}
    proposalType={ProposalType.NORMAL}
  />
);
export const Queued = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon with very very very very very very very very very very very very very very very very long text example"
    proposalState="Queued"
    cancelDate={undefined}
    endDate={new Date()}
    proposalType={ProposalType.FAST_TRACK}
  />
);
export const Pending = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Pending"
    cancelDate={undefined}
    endDate={new Date()}
    proposalType={ProposalType.CRITICAL}
  />
);
export const Executed = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Executed"
    cancelDate={undefined}
    endDate={new Date()}
    proposalType={ProposalType.NORMAL}
  />
);
export const Cancelled = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Canceled"
    cancelDate={new Date(Date.now())}
    endDate={new Date(Date.now())}
    proposalType={ProposalType.FAST_TRACK}
  />
);

export const Defeated = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Defeated"
    cancelDate={undefined}
    endDate={new Date(Date.now())}
    proposalType={ProposalType.CRITICAL}
  />
);

export const Succeeded = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Succeeded"
    cancelDate={undefined}
    endDate={new Date(Date.now())}
    proposalType={ProposalType.NORMAL}
  />
);

export const Expired = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState="Expired"
    cancelDate={undefined}
    endDate={new Date(Date.now())}
    proposalType={ProposalType.FAST_TRACK}
  />
);
