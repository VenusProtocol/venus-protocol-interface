import type { Meta } from '@storybook/react';

import { assetData } from '__mocks__/models/asset';

import { MarketActionsButton } from '.';

export default {
  title: 'Pages/PrimeLeaderboard/MarketActionsButton',
  component: MarketActionsButton,
} as Meta<typeof MarketActionsButton>;

const asset = assetData[0];

export const SupplySide = () => (
  <MarketActionsButton asset={asset} poolComptrollerAddress={asset.vToken.address} side="supply" />
);

export const BorrowSide = () => (
  <MarketActionsButton asset={asset} poolComptrollerAddress={asset.vToken.address} side="borrow" />
);

export const BothSides = () => (
  <MarketActionsButton asset={asset} poolComptrollerAddress={asset.vToken.address} side="both" />
);

export const AllSides = () => (
  <div className="flex items-center gap-8">
    {(['supply', 'borrow', 'both'] as const).map(side => (
      <div key={side} className="flex flex-col items-center gap-2">
        <MarketActionsButton
          asset={asset}
          poolComptrollerAddress={asset.vToken.address}
          side={side}
        />
        <span className="text-xs text-light-grey">{side}</span>
      </div>
    ))}
  </div>
);
