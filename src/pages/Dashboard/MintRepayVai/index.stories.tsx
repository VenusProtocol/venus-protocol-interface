import React from 'react';
import noop from 'noop-ts';

import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withAuthContext, withEnabledToken } from 'stories/decorators';
import MintRepayVai, { IMintRepayVaiProps } from '.';

export default {
  title: 'Pages/Dashboard/MintRepayVai',
  component: MintRepayVai,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof MintRepayVai>;

const Template: Story<IMintRepayVaiProps> = props => <MintRepayVai {...props} />;

const context = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  account: {
    address: '0x0000000000000000000000000000000000000000',
  },
};

export const Disconnected = Template.bind({});

export const Disabled = Template.bind({});
Disabled.decorators = [withAuthContext(context)];

export const Default = Template.bind({});
Default.decorators = [withAuthContext(context), withEnabledToken('vai')];
