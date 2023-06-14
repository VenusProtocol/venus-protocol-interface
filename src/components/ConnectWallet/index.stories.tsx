import { Meta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { Prompt as PromptUi } from '.';

export default {
  title: 'Components/ConnectWallet',
  component: PromptUi,
  decorators: [withCenterStory({ width: 450 })],
} as Meta<typeof PromptUi>;

export const Prompt = () => (
  <PromptUi message="Please connect your wallet to mint VAI" openAuthModal={noop} connected={false}>
    Protected content
  </PromptUi>
);
