import { BigNumber } from 'bignumber.js';
import React from 'react';
import { ProposalState, ProposalType } from 'types';

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
    proposalState={ProposalState.Active}
    forVotesMantissa={new BigNumber('500000000000000000')}
    againstVotesMantissa={new BigNumber('2000000000000000000')}
    abstainedVotesMantissa={new BigNumber('0')}
    cancelDate={undefined}
    endDate={new Date(Date.now() + 3650000)}
    proposalType={ProposalType.NORMAL}
  />
);
export const Queued = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon with very very very very very very very very very very very very very very very very long text example"
    proposalState={ProposalState.Queued}
    cancelDate={undefined}
    endDate={new Date()}
    proposalType={ProposalType.FAST_TRACK}
  />
);
export const Pending = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Pending}
    cancelDate={undefined}
    endDate={new Date()}
    proposalType={ProposalType.CRITICAL}
  />
);
export const Executed = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Executed}
    cancelDate={undefined}
    endDate={new Date()}
    proposalType={ProposalType.NORMAL}
  />
);
export const Cancelled = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Canceled}
    cancelDate={new Date(Date.now())}
    endDate={new Date(Date.now())}
    proposalType={ProposalType.FAST_TRACK}
  />
);

export const Defeated = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Defeated}
    cancelDate={undefined}
    endDate={new Date(Date.now())}
    proposalType={ProposalType.CRITICAL}
  />
);

export const Succeeded = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Succeeded}
    cancelDate={undefined}
    endDate={new Date(Date.now())}
    proposalType={ProposalType.NORMAL}
  />
);

export const Expired = () => (
  <GovernanceProposal
    proposalId={58}
    proposalTitle="Buy back and burn and Tokenomic contribution finished soon"
    proposalState={ProposalState.Expired}
    cancelDate={undefined}
    endDate={new Date(Date.now())}
    proposalType={ProposalType.FAST_TRACK}
  />
);
