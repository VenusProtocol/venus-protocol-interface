import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter } from 'stories/decorators';
import Proposal from '.';

export default {
  title: 'Pages/Proposal',
  component: Proposal,
  decorators: [withRouter],
} as ComponentMeta<typeof Proposal>;

export const Default = () => <Proposal />;
