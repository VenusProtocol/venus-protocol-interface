import type { Meta } from '@storybook/react';

import { poolData } from '__mocks__/models/pools';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import AssetWarning from '.';

export default {
  title: 'Components/AssetWarningUi',
  component: AssetWarning,
  decorators: [withThemeProvider, withCenterStory({ width: 500 })],
} as Meta<typeof AssetWarning>;

export const Borrow = () => (
  <AssetWarning
    pool={poolData[0]}
    token={poolData[0].assets[0].vToken.underlyingToken}
    type="borrow"
  />
);

export const Supply = () => (
  <AssetWarning
    pool={poolData[0]}
    token={poolData[0].assets[0].vToken.underlyingToken}
    type="supply"
  />
);
