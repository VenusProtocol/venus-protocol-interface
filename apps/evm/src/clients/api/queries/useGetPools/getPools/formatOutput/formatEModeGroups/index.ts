import BigNumber from 'bignumber.js';

import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import type { ChainId, EModeAssetSettings, EModeGroup, Token } from 'types';
import {
  areAddressesEqual,
  convertFactorFromSmartContract,
  convertPercentageFromSmartContract,
} from 'utilities';
import type { ApiPool } from '../../getApiPools';
import { formatVToken } from '../formatVToken';

export const formatEModeGroups = ({
  apiPool,
  tokens,
  chainId,
}: {
  apiPool: ApiPool;
  tokens: Token[];
  chainId: ChainId;
}) => {
  const eModeGroups: EModeGroup[] = apiPool.eModeGroups.map(apiEModeGroup => {
    const assetSettings = apiEModeGroup.eModeSettings.reduce<EModeAssetSettings[]>(
      (acc, settings) => {
        const apiMarket = apiPool.markets.find(m =>
          areAddressesEqual(m.address, settings.marketAddress),
        );

        if (!apiMarket) {
          return acc;
        }

        const vToken = formatVToken({
          apiMarket,
          tokens,
          chainId,
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
      assetSettings,
    };

    return eModeGroup;
  });

  return eModeGroups;
};
