import React from 'react';
import { ComponentMeta } from '@storybook/react';
import noop from 'noop-ts';

import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { AuthModal } from '.';

export default {
  title: 'Components/AuthModal',
  component: AuthModal,
  decorators: [withThemeProvider, withCenterStory({ width: 800 })],
} as ComponentMeta<typeof AuthModal>;

export const Default = () => (
  <AuthModal isOpen onClose={noop} onLogOut={noop} onLogin={noop} onCopyAccount={noop} />
);

export const WithAccount = () => (
  <AuthModal
    isOpen
    onClose={noop}
    onLogOut={noop}
    onLogin={noop}
    onCopyAccount={noop}
    account="0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706"
  />
);
