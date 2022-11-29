import Typography from '@mui/material/Typography';
import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { TOKENS } from 'constants/tokens';
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
    token={TOKENS.xvs}
    isTokenEnabled={false}
    enableToken={async () => fakeTransactionReceipt}
  >
    <Typography>Invisible Content</Typography>
  </EnableTokenUi>
);

export const DisabledWithTokenInfo = () => (
  <EnableTokenUi
    title="To withdraw USDC to the Venus Protocol, you need to enable it first."
    token={TOKENS.usdc}
    isTokenEnabled={false}
    tokenInfo={[
      { iconSrc: TOKENS.usdc, label: 'Supply APY', children: '77.36' },
      { iconSrc: TOKENS.usdc, label: 'Distribution APY', children: '0.82' },
    ]}
    enableToken={async () => fakeTransactionReceipt}
  >
    <Typography>Invisible Content</Typography>
  </EnableTokenUi>
);

export const Enabled = () => (
  <EnableTokenUi
    title="Enable Token"
    isTokenEnabled
    token={TOKENS.usdc}
    tokenInfo={[]}
    enableToken={async () => fakeTransactionReceipt}
  >
    <Typography>Visible Content</Typography>
  </EnableTokenUi>
);
