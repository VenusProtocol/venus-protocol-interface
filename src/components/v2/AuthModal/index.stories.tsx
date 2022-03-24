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

export const Default = () => <AuthModal isOpen onClose={noop} onLogOut={noop} onLogin={noop} />;
