import Typography from '@mui/material/Typography';
import { ComponentMeta } from '@storybook/react';
import { noop } from 'lodash';
import React from 'react';

import TEST_TOKENS from '__mocks__/models/tokens';
import { withCenterStory } from 'stories/decorators';

import { EnableTokenUi } from '.';

export default {
  title: 'Components/EnableToken',
  component: EnableTokenUi,
  decorators: [withCenterStory({ width: 450 })],
} as ComponentMeta<typeof EnableTokenUi>;

export const Disabled = () => (
  <EnableTokenUi
    title="To withdraw XVS to the Venus Protocol, you need to enable it first."
    token={TEST_TOKENS.xvs}
    isTokenEnabled={false}
    enableToken={noop}
  >
    <Typography>Invisible Content</Typography>
  </EnableTokenUi>
);

export const DisabledWithTokenInfo = () => (
  <EnableTokenUi
    title="To withdraw USDC to the Venus Protocol, you need to enable it first."
    token={TEST_TOKENS.usdc}
    isTokenEnabled={false}
    tokenInfo={[
      { iconSrc: TEST_TOKENS.usdc, label: 'Supply APY', children: '77.36' },
      { iconSrc: TEST_TOKENS.usdc, label: 'Distribution APY', children: '0.82' },
    ]}
    enableToken={noop}
  >
    <Typography>Invisible Content</Typography>
  </EnableTokenUi>
);

export const Enabled = () => (
  <EnableTokenUi
    title="Enable Token"
    isTokenEnabled
    token={TEST_TOKENS.usdc}
    tokenInfo={[]}
    enableToken={noop}
  >
    <Typography>Visible Content</Typography>
  </EnableTokenUi>
);
