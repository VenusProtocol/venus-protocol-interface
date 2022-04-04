import React from 'react';

import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { ConnectWallet } from '.';

export default {
  title: 'Components/ConnectWallet',
  component: ConnectWallet,
  decorators: [withThemeProvider, withCenterStory({ width: 450 })],
} as ComponentMeta<typeof ConnectWallet>;

export const Default = () => <ConnectWallet message="Please connect your wallet to mint VAI" />;
