import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import noop from 'noop-ts';
import { assetData } from '__mocks__/models/asset';
import { SupplyMarketUi } from './SupplyMarket';

const asset = assetData[0];

export default {
  title: 'Pages/Dashboard/SupplyMarket',
  component: SupplyMarketUi,
  decorators: [withCenterStory({ width: 600 })],
  subcomponents: { SupplyMarketUi },
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof SupplyMarketUi>;

export const Default = () => (
  <SupplyMarketUi
    assets={assetData}
    withXvs={false}
    toggleAssetCollateral={noop}
    confirmCollateral={undefined}
    setConfirmCollateral={noop}
  />
);

export const LoadingModal = () => (
  <SupplyMarketUi
    assets={assetData}
    withXvs={false}
    toggleAssetCollateral={noop}
    confirmCollateral={asset}
    setConfirmCollateral={noop}
  />
);
