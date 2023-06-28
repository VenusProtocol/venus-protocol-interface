import Typography from '@mui/material/Typography';
import { Meta } from '@storybook/react';
import React from 'react';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { TOKENS } from 'constants/tokens';
import { withCenterStory } from 'stories/decorators';

import { ApproveTokenUi } from '.';

export default {
  title: 'Components/ApproveToken',
  component: ApproveTokenUi,
  decorators: [withCenterStory({ width: 450 })],
} as Meta<typeof ApproveTokenUi>;

export const Disabled = () => (
  <ApproveTokenUi
    title="To withdraw XVS to the Venus Protocol, you need to approve it first."
    token={TOKENS.xvs}
    isTokenApproved={false}
    approveToken={async () => fakeContractReceipt}
  >
    <Typography>Invisible Content</Typography>
  </ApproveTokenUi>
);

export const DisabledWithTokenInfo = () => (
  <ApproveTokenUi
    title="To withdraw USDC to the Venus Protocol, you need to approve it first."
    token={TOKENS.usdc}
    isTokenApproved={false}
    assetInfo={[
      { iconSrc: TOKENS.usdc, label: 'Supply APY', children: '77.36' },
      { iconSrc: TOKENS.usdc, label: 'Distribution APY', children: '0.82' },
    ]}
    approveToken={async () => fakeContractReceipt}
  >
    <Typography>Invisible Content</Typography>
  </ApproveTokenUi>
);

export const Enabled = () => (
  <ApproveTokenUi
    title="Enable Token"
    isTokenApproved
    token={TOKENS.usdc}
    assetInfo={[]}
    approveToken={async () => fakeContractReceipt}
  >
    <Typography>Visible Content</Typography>
  </ApproveTokenUi>
);
