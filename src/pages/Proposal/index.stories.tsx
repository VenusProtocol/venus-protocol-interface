import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter } from 'stories/decorators';
import proposals from '__mocks__/models/proposals';
import { ProposalUi } from '.';

export default {
  title: 'Pages/Proposal',
  component: ProposalUi,
  decorators: [withRouter],
} as ComponentMeta<typeof ProposalUi>;

export const Default = () => <ProposalUi proposal={proposals[0]} />;
