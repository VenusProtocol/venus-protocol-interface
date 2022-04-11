import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import Typography from '@mui/material/Typography';
import { EnableToken } from '.';

export default {
  title: 'Components/EnableToken',
  component: EnableToken,
  decorators: [withCenterStory({ width: 450 })],
} as ComponentMeta<typeof EnableToken>;

export const Disabled = () => (
  <EnableToken
    isEnabled={false}
    title="To withdraw BNB to the Venus Protocol, you need to enable it first."
    symbol="eth"
    tokenInfo={[
      { symbol: 'vai', text: 'Supply APY', apy: 77.36 },
      { symbol: 'vai', text: 'Distribution APY', apy: 0.82 },
    ]}
  >
    <Typography>Invisible Content</Typography>
  </EnableToken>
);

export const Enabled = () => (
  <EnableToken isEnabled title="Enable Token" symbol="eth" tokenInfo={[]}>
    <Typography>Visible Content</Typography>
  </EnableToken>
);
