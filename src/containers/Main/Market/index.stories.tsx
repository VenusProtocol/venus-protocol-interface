import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import Market from '.';

export default {
  title: 'Pages/Market',
  component: Market,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof Market>;

export { Market };
