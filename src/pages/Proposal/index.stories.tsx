import React from 'react';
import noop from 'noop-ts';
import { ComponentMeta } from '@storybook/react';
import { withRouter } from 'stories/decorators';
import proposals from '__mocks__/models/proposals';
import vote from '__mocks__/models/vote';
import { ProposalUi } from '.';

export default {
  title: 'Pages/Proposal',
  component: ProposalUi,
  decorators: [withRouter],
} as ComponentMeta<typeof ProposalUi>;

export const Default = () => (
  <ProposalUi
    proposal={proposals[0]}
    forVoters={vote}
    againstVoters={vote}
    abstainVoters={vote}
    votingEnabled
    readableVoteWeight="123390000"
    vote={noop}
    isVoteLoading={false}
  />
);
