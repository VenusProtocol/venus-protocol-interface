import type { Meta } from '@storybook/react';
import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { AssetCard } from '.';

export default {
  title: 'Components/AssetCard',
  component: AssetCard,
} as Meta<typeof AssetCard>;

const fakeAsset = assetData[0];

export const Default = () => (
  <AssetCard asset={fakeAsset} poolComptrollerContractAddress={fakeAddress} type="supply" />
);
