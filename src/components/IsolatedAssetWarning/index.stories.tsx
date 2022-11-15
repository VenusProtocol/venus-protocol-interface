import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { IsolatedAssetWarningUi } from '.';

export default {
  title: 'Components/IsolatedAssetWarningUi',
  component: IsolatedAssetWarningUi,
  decorators: [withThemeProvider, withCenterStory({ width: 500 })],
} as ComponentMeta<typeof IsolatedAssetWarningUi>;

export const Borrow = () => (
  <IsolatedAssetWarningUi pool={poolData[0]} asset={poolData[0].assets[0]} type="borrow" />
);

export const Supply = () => (
  <IsolatedAssetWarningUi pool={poolData[0]} asset={poolData[0].assets[0]} type="supply" />
);
