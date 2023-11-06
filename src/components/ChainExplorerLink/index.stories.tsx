import { Meta } from '@storybook/react';
import React from 'react';
import { ChainId } from 'types';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { ChainExplorerLink } from '.';

export default {
  title: 'Components/ChainExplorerLink',
  component: ChainExplorerLink,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
} as Meta<typeof ChainExplorerLink>;

export const Default = () => (
  <ChainExplorerLink
    hash="0x6b8a5663cd46f7b719391c518c60e2f45427b95a082e3e47739b011faccbfc96"
    chainId={ChainId.BSC_TESTNET}
  />
);
