import React from 'react';
import { BigNumber } from 'bignumber.js';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { VoteProposalUi } from '.';

export default {
  title: 'Components/VoteProposalUi',
  decorators: [withThemeProvider, withCenterStory({ width: 750 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
};

export const Active = () => (
  <VoteProposalUi
    proposalNumber={58}
    proposalText="Buy back and burn and Tokenomic contribution finished soon"
    proposalStatus="active"
    votedForWei={new BigNumber('500000000000000000')}
    votedAgainstWei={new BigNumber('2000000000000000000')}
    abstainedWei={new BigNumber('0')}
    userVoteStatus="votedFor"
    cancelDate={new Date(Date.now() + 3650000)}
    tokenId="xvs"
  />
);
export const Queued = () => (
  <VoteProposalUi
    proposalNumber={58}
    proposalText="Buy back and burn and Tokenomic contribution finished soon with very very very very very very very very very very very very very very very very long text example"
    proposalStatus="queued"
    cancelDate={new Date(Date.now() + 3650000)}
  />
);
export const ReadyToExecute = () => (
  <VoteProposalUi
    proposalNumber={58}
    proposalText="Buy back and burn and Tokenomic contribution finished soon"
    proposalStatus="readyToExecute"
    cancelDate={new Date(Date.now() + 3650000)}
  />
);
export const Executed = () => (
  <VoteProposalUi
    proposalNumber={58}
    proposalText="Buy back and burn and Tokenomic contribution finished soon"
    proposalStatus="executed"
    cancelDate={new Date(Date.now() + 3650000)}
  />
);
export const Cancelled = () => (
  <VoteProposalUi
    proposalNumber={58}
    proposalText="Buy back and burn and Tokenomic contribution finished soon"
    proposalStatus="cancelled"
    cancelDate={new Date(Date.now())}
  />
);
