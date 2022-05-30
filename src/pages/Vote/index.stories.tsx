import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter } from 'stories/decorators';
import Vote from '.';

export default {
  title: 'Pages/Vote',
  component: Vote,
  decorators: [withRouter],
} as ComponentMeta<typeof Vote>;

export const Default = () => <Vote />;
