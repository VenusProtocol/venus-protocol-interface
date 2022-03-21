import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import Vote from '.';

export default {
  title: 'Pages/Vote',
  component: Vote,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof Vote>;

export { Vote };
