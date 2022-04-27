import React from 'react';
import { ComponentMeta } from '@storybook/react';
import noop from 'noop-ts';
import { withCenterStory } from 'stories/decorators';
import { assetData } from '__mocks__/models/asset';
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
    suppliedAssets={assetData}
    supplyMarketAssets={assetData}
    isXvsEnabled={false}
    toggleAssetCollateral={noop}
    confirmCollateral={undefined}
    setConfirmCollateral={noop}
  />
);

export const LoadingModal = () => (
  <SupplyMarketUi
    suppliedAssets={assetData}
    supplyMarketAssets={assetData}
    isXvsEnabled={false}
    toggleAssetCollateral={noop}
    confirmCollateral={asset}
    setConfirmCollateral={noop}
  />
);
