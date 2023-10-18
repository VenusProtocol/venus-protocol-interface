import { Meta } from '@storybook/react';
import noop from 'noop-ts';

import proposals from '__mocks__/models/proposals';
import tokens from '__mocks__/models/tokens';
import voters from '__mocks__/models/voters';
import { withRouter } from 'stories/decorators';

import { ProposalUi } from '.';

export default {
  title: 'Pages/Proposal',
  component: ProposalUi,
  decorators: [withRouter],
} as Meta<typeof ProposalUi>;

export const Default = () => (
  <ProposalUi
    tokens={tokens}
    proposal={proposals[0]}
    forVoters={voters}
    againstVoters={voters}
    abstainVoters={voters}
    votingEnabled
    readableVoteWeight="123390000"
    vote={noop}
    isVoteLoading={false}
  />
);
