import {
  type ApyBreakdownItem,
  ApyBreakdown as GenericApyBreakdown,
} from 'components/ApyBreakdown';
import type { BalanceMutation, Pool } from 'types';
import { areAddressesEqual } from 'utilities';

export interface ApyBreakdownProps {
  pool: Pool;
  simulatedPool?: Pool;
  balanceMutations?: BalanceMutation[];
  renderType?: 'block' | 'accordion';
}

export const ApyBreakdown: React.FC<ApyBreakdownProps> = ({
  pool,
  simulatedPool,
  balanceMutations = [],
  renderType = 'block',
}) => {
  const items = balanceMutations.reduce<ApyBreakdownItem[]>((acc, balanceMutation) => {
    if (balanceMutation.type !== 'asset') {
      return acc;
    }

    const asset = pool.assets.find(a =>
      areAddressesEqual(a.vToken.address, balanceMutation.vTokenAddress),
    );

    if (!asset) {
      return acc;
    }

    const simulatedAsset = simulatedPool?.assets.find(a =>
      areAddressesEqual(a.vToken.address, balanceMutation.vTokenAddress),
    );
    const isBorrow = balanceMutation.action === 'borrow' || balanceMutation.action === 'repay';

    const item: ApyBreakdownItem = {
      type: isBorrow ? 'borrow' : 'supply',
      token: asset.vToken.underlyingToken,
      baseApyPercentage: isBorrow ? asset.borrowApyPercentage : asset.supplyApyPercentage,
      tokenDistributions: isBorrow
        ? asset.borrowTokenDistributions
        : asset.supplyTokenDistributions,
      simulatedBaseApyPercentage: isBorrow
        ? simulatedAsset?.borrowApyPercentage
        : simulatedAsset?.supplyApyPercentage,
      simulatedTokenDistributions: isBorrow
        ? simulatedAsset?.borrowTokenDistributions
        : simulatedAsset?.supplyTokenDistributions,
    };

    return [...acc, item];
  }, []);

  return <GenericApyBreakdown items={items} renderType={renderType} />;
};
