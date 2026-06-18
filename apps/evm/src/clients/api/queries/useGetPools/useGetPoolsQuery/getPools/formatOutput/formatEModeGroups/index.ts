import BigNumber from 'bignumber.js';

import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import type { EModeAssetSettings, EModeGroup, VToken } from 'types';
import {
  areAddressesEqual,
  convertFactorFromSmartContract,
  convertPercentageFromSmartContract,
  findTokenByAddress,
} from 'utilities';
import type { ApiPool } from '../../getApiPools';

export const formatEModeGroups = ({
  apiPool,
  vTokens,
}: {
  apiPool: ApiPool;
  vTokens: VToken[];
}) => {
  const eModeGroups: EModeGroup[] = (apiPool.eModeGroups || []).map(apiEModeGroup => {
    const assetSettings = apiEModeGroup.eModeSettings.reduce<EModeAssetSettings[]>(
      (acc, settings) => {
        const apiMarket = apiPool.markets.find(m =>
          areAddressesEqual(m.address, settings.marketAddress),
        );

        if (!apiMarket) {
          return acc;
        }

        const vToken = findTokenByAddress({
          tokens: vTokens,
          address: apiMarket.address,
        });

        if (!vToken) {
          return acc;
        }

        const collateralFactor = convertFactorFromSmartContract({
          factor: new BigNumber(settings.collateralFactorMantissa),
        });

        const liquidationThresholdPercentage = convertPercentageFromSmartContract(
          settings.liquidationThresholdMantissa,
        );

        const liquidationPenaltyPercentage = convertPercentageFromSmartContract(
          new BigNumber(settings.liquidationIncentiveMantissa).minus(COMPOUND_MANTISSA),
        );

        const eModeAssetSettings: EModeAssetSettings = {
          vToken,
          collateralFactor,
          liquidationThresholdPercentage,
          liquidationPenaltyPercentage,
          isBorrowable: settings.isBorrowable,
        };

        return [...acc, eModeAssetSettings];
      },
      [],
    );

    const eModeGroup: EModeGroup = {
      name: apiEModeGroup.label,
      id: apiEModeGroup.poolId,
      isActive: apiEModeGroup.isActive,
      isIsolated: !apiEModeGroup.allowCorePoolFallback,
      assetSettings,
    };

    return eModeGroup;
  });

  return eModeGroups;
};
