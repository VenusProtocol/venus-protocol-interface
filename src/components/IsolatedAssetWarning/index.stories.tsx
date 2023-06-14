import { Meta } from '@storybook/react';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { withCenterStory, withThemeProvider } from 'stories/decorators';

import IsolatedAssetWarning from '.';

export default {
  title: 'Components/IsolatedAssetWarningUi',
  component: IsolatedAssetWarning,
  decorators: [withThemeProvider, withCenterStory({ width: 500 })],
} as Meta<typeof IsolatedAssetWarning>;

export const Borrow = () => (
  <IsolatedAssetWarning
    pool={poolData[0]}
    token={poolData[0].assets[0].vToken.underlyingToken}
    type="borrow"
  />
);

export const Supply = () => (
  <IsolatedAssetWarning
    pool={poolData[0]}
    token={poolData[0].assets[0].vToken.underlyingToken}
    type="supply"
  />
);
