import React from 'react';
import { noop } from 'lodash';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import Typography from '@mui/material/Typography';
import { EnableTokenUi } from '.';

export default {
  title: 'Components/EnableToken',
  component: EnableTokenUi,
  decorators: [withCenterStory({ width: 450 })],
} as ComponentMeta<typeof EnableTokenUi>;

export const Disabled = () => (
  <EnableTokenUi
    isEnabled={false}
    title="To withdraw BNB to the Venus Protocol, you need to enable it first."
    symbol="eth"
    tokenInfo={[
      { symbol: 'vai', text: 'Supply APY', apy: 77.36 },
      { symbol: 'vai', text: 'Distribution APY', apy: 0.82 },
    ]}
    approveToken={noop}
    disabled
  >
    <Typography>Invisible Content</Typography>
  </EnableTokenUi>
);

export const Enabled = () => (
  <EnableTokenUi
    isEnabled
    title="Enable Token"
    symbol="eth"
    tokenInfo={[]}
    approveToken={noop}
    disabled={false}
  >
    <Typography>Visible Content</Typography>
  </EnableTokenUi>
);
