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
    assetId="eth"
    approveToken={noop}
    disabled
  >
    <Typography>Invisible Content</Typography>
  </EnableTokenUi>
);

export const DisabledWithTokenInfo = () => (
  <EnableTokenUi
    isEnabled={false}
    title="To withdraw BNB to the Venus Protocol, you need to enable it first."
    assetId="eth"
    tokenInfo={[
      { iconName: 'vai', label: 'Supply APY', children: '77.36' },
      { iconName: 'vai', label: 'Distribution APY', children: '0.82' },
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
    assetId="eth"
    tokenInfo={[]}
    approveToken={noop}
    disabled={false}
  >
    <Typography>Visible Content</Typography>
  </EnableTokenUi>
);
