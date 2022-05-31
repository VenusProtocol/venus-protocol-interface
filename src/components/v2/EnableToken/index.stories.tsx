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
    title="To withdraw BNB to the Venus Protocol, you need to enable it first."
    vTokenId="eth"
    isTokenEnabled={false}
    enableToken={noop}
  >
    <Typography>Invisible Content</Typography>
  </EnableTokenUi>
);

export const DisabledWithTokenInfo = () => (
  <EnableTokenUi
    title="To withdraw BNB to the Venus Protocol, you need to enable it first."
    vTokenId="eth"
    isTokenEnabled={false}
    tokenInfo={[
      { iconName: 'vai', label: 'Supply APY', children: '77.36' },
      { iconName: 'vai', label: 'Distribution APY', children: '0.82' },
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
    vTokenId="eth"
    tokenInfo={[]}
    enableToken={noop}
  >
    <Typography>Visible Content</Typography>
  </EnableTokenUi>
);
