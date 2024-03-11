import type { Meta } from '@storybook/react';

import { withCenterStory, withRouter } from 'stories/decorators';

import ConvertVRT, { ConvertVrtUi } from '.';

export default {
  title: 'Pages/ConvertVRT',
  component: ConvertVrtUi,
  decorators: [withRouter, withCenterStory({ width: '100vh' })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as Meta<typeof ConvertVrtUi>;

export const ConnectWallet = () => <ConvertVRT />;
