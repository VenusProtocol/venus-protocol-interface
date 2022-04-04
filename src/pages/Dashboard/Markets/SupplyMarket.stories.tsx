import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import noop from 'noop-ts';
import { SupplyMarketUi } from './SupplyMarket';
import { assetData } from './mocks';

export default {
  title: 'Components/SupplyMarket',
  component: SupplyMarketUi,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
  subcomponents: { SupplyMarketUi },
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof SupplyMarketUi>;

export const Default = () => (
  <SupplyMarketUi assets={assetData} withXvs={false} toggleAssetCollateral={noop} />
);
