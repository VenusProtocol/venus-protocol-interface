import { ComponentMeta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import { assetData } from '__mocks__/models/asset';
import { withCenterStory } from 'stories/decorators';

import { SupplyMarketUi } from '.';

const asset = assetData[0];

export default {
  title: 'Pages/Dashboard/SupplyMarket',
  component: SupplyMarketUi,
  decorators: [withCenterStory({ width: 600 })],
  subcomponents: { SupplyMarketUi },
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof SupplyMarketUi>;

export const Default = () => (
  <SupplyMarketUi
    supplyMarketAssets={assetData}
    isXvsEnabled={false}
    toggleAssetCollateral={noop}
    confirmCollateral={undefined}
    setConfirmCollateral={noop}
    hasLunaOrUstCollateralEnabled={false}
    openLunaUstWarningModal={noop}
  />
);

export const LoadingModal = () => (
  <SupplyMarketUi
    supplyMarketAssets={assetData}
    isXvsEnabled={false}
    toggleAssetCollateral={noop}
    confirmCollateral={asset}
    setConfirmCollateral={noop}
    hasLunaOrUstCollateralEnabled={false}
    openLunaUstWarningModal={noop}
  />
);
