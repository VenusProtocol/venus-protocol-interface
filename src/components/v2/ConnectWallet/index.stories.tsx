import React from 'react';
import noop from 'noop-ts';

import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { Prompt as PromptUi } from '.';

export default {
  title: 'Components/ConnectWallet',
  component: PromptUi,
  decorators: [withCenterStory({ width: 450 })],
} as ComponentMeta<typeof PromptUi>;

export const Prompt = () => (
  <PromptUi message="Please connect your wallet to mint VAI" openAuthModal={noop} connected={false}>
    Protected content
  </PromptUi>
);
