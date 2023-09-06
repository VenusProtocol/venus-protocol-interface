import { Meta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { ChainId } from 'types';

import { withCenterStory } from 'stories/decorators';

import { AuthModal } from '.';

export default {
  title: 'Components/AuthModal',
  component: AuthModal,
  decorators: [withCenterStory({ width: 800 })],
} as Meta<typeof AuthModal>;

export const Default = () => <AuthModal isOpen onClose={noop} onLogOut={noop} onLogin={noop} />;

export const WithAccount = () => (
  <AuthModal
    isOpen
    onClose={noop}
    onLogOut={noop}
    onLogin={noop}
    accountAddress="0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706"
    chainId={ChainId.BSC_TESTNET}
  />
);
