import type { Asset, EModeGroup, Pool } from 'types';
import { areTokensEqual, calculateHealthFactor } from 'utilities';
import { getHypotheticalAssetValues } from '../getHypotheticalAssetValues';

interface ExtendedEModeGroup extends EModeGroup {
  userBlockingAssets: Asset[];
  userHasEnoughCollateral: boolean;
  hypotheticalUserHealthFactor: number;
}

export const formatEModeGroups = ({ pool, searchValue }: { pool: Pool; searchValue: string }) =>
  pool.eModeGroups
    .reduce<ExtendedEModeGroup[]>((acc, eModeGroup) => {
      // Handle search
      const searchMatches = (value: string) =>
        value.toLowerCase().includes(searchValue.toLowerCase());

      const filteredEModeAssetSettings = eModeGroup.assetSettings.filter(settings =>
        searchMatches(settings.vToken.underlyingToken.symbol),
      );

      const nameMatches = searchMatches(eModeGroup.name);

      if (filteredEModeAssetSettings.length === 0 && !nameMatches) {
        // Filter out E-mode group
        return acc;
      }

      const isEModeGroupEnabled = pool.userEModeGroup && pool.userEModeGroup.id === eModeGroup.id;

      // These values are used to determine if a user can enable the E-mode group if it's not enabled
      // already, or disable it if it's enabled
      const userBlockingAssets: Asset[] = [];
      let hypotheticalUserLiquidationThresholdCents = 0;
      let hypotheticalUserBorrowLimitCents = 0;
      let hypotheticalUserBorrowBalanceCents = 0;

      pool.assets.forEach(asset => {
        const assetSettings = eModeGroup.assetSettings.find(settings =>
          areTokensEqual(settings.vToken, asset.vToken),
        );

        const { isBlocking, liquidationThresholdCents, borrowLimitCents, borrowBalanceCents } =
          getHypotheticalAssetValues({
            userSupplyBalanceCents: asset.userSupplyBalanceCents.toNumber(),
            userBorrowBalanceCents: asset.userBorrowBalanceCents.toNumber(),
            isCollateralOfUser: asset.isCollateralOfUser,
            isBorrowable: isEModeGroupEnabled ? asset.isBorrowable : !!assetSettings?.isBorrowable,
            collateralFactor: isEModeGroupEnabled
              ? asset.collateralFactor
              : assetSettings?.collateralFactor ?? asset.collateralFactor,
            liquidationThresholdPercentage: isEModeGroupEnabled
              ? asset.liquidationThresholdPercentage
              : assetSettings?.liquidationThresholdPercentage ??
                asset.liquidationThresholdPercentage,
          });

        if (isBlocking) {
          userBlockingAssets.push(asset);
        }

        hypotheticalUserLiquidationThresholdCents += liquidationThresholdCents;
        hypotheticalUserBorrowLimitCents += borrowLimitCents;
        hypotheticalUserBorrowBalanceCents += borrowBalanceCents;
      });

      const userHasEnoughCollateral =
        hypotheticalUserBorrowLimitCents >= hypotheticalUserBorrowBalanceCents;

      const hypotheticalUserHealthFactor = calculateHealthFactor({
        liquidationThresholdCents: hypotheticalUserLiquidationThresholdCents,
        borrowBalanceCents: hypotheticalUserBorrowBalanceCents,
      });

      const extendedEModeGroup: ExtendedEModeGroup = {
        ...eModeGroup,
        assetSettings: filteredEModeAssetSettings,
        userHasEnoughCollateral,
        userBlockingAssets,
        hypotheticalUserHealthFactor,
      };

      return [...acc, extendedEModeGroup];
    }, [])
    .sort((a, b) => {
      const isAEnabled = a.id === pool.userEModeGroup?.id;
      const isBEnabled = b.id === pool.userEModeGroup?.id;

      // Sort enabled group first
      if (isAEnabled !== isBEnabled) {
        return Number(isBEnabled) - Number(isAEnabled);
      }

      const aCanBeEnabled = a.userBlockingAssets.length === 0 && a.userHasEnoughCollateral;
      const bCanBeEnabled = a.userBlockingAssets.length === 0 && a.userHasEnoughCollateral;

      // Sort alphabetically if both groups can't be enabled
      if (!aCanBeEnabled && !bCanBeEnabled) {
        return a.name.localeCompare(b.name);
      }

      // Sort groups that can't be enabled last
      if (!aCanBeEnabled) {
        return 1;
      }
      if (!bCanBeEnabled) {
        return -1;
      }

      // Sort groups that can be enabled by hypothetical health factor, from highest to lowest
      return a.hypotheticalUserHealthFactor - b.hypotheticalUserHealthFactor;
    });
