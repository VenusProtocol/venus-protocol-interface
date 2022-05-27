import React from 'react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { VoteProposalUi } from '.';

export default {
  title: 'Components/VoteProposalUi',
  decorators: [withThemeProvider, withCenterStory({ width: 750 })],
  parameters: {
    backgrounds: {
      default: 'Default',
    },
  },
};

export const Active = () => (
  <VoteProposalUi
    proposalNumber={58}
    proposalText="Buy back and burn and Tokenomic contribution finised soon"
    proposalStatus="active"
    votedFor="2130.02 XVS"
    votedAgainst="2130.02 XVS"
    abstain="100 XVS"
    voteStatus="votedFor"
  />
);
export const Queued = () => (
  <VoteProposalUi
    proposalNumber={58}
    proposalText="Buy back and burn and Tokenomic contribution finised soon"
    proposalStatus="queued"
  />
);
export const ReadyToExecute = () => (
  <VoteProposalUi
    proposalNumber={58}
    proposalText="Buy back and burn and Tokenomic contribution finised soon"
    proposalStatus="readyToExecute"
  />
);
export const Executed = () => (
  <VoteProposalUi
    proposalNumber={58}
    proposalText="Buy back and burn and Tokenomic contribution finised soon"
    proposalStatus="executed"
  />
);
export const Cancelled = () => (
  <VoteProposalUi
    proposalNumber={58}
    proposalText="Buy back and burn and Tokenomic contribution finised soon"
    proposalStatus="cancelled"
  />
);
