import type { To } from 'react-router';

import { routes } from 'constants/routing';
import { TAB_PARAM_KEY } from 'hooks/useTabs';
import type { EModeGroup, Pool, Token } from 'types';
import { areTokensEqual, calculateHealthFactor } from 'utilities';
import { getHypotheticalAssetValues } from '../getHypotheticalAssetValues';
import type { BlockingBorrowPosition } from '../types';

interface ExtendedEModeGroup extends EModeGroup {
  userBlockingBorrowPositions: BlockingBorrowPosition[];
  userHasEnoughCollateral: boolean;
  hypotheticalUserHealthFactor: number;
}

export const formatEModeGroups = ({
  pool,
  searchValue,
  vai,
  formatTo,
}: { pool: Pool; searchValue: string; formatTo: ({ to }: { to: To }) => To; vai?: Token }) =>
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

      // These values are used to determine if a user can enable the E-mode group if it's not
      // enabled already, or disable it if it's enabled
      const userBlockingBorrowPositions: BlockingBorrowPosition[] = [];
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
          const blockingBorrowPosition: BlockingBorrowPosition = {
            token: asset.vToken.underlyingToken,
            userBorrowBalanceTokens: asset.userBorrowBalanceTokens,
            userBorrowBalanceCents: asset.userBorrowBalanceCents.toNumber(),
            to: formatTo({
              to: {
                pathname: routes.market.path
                  .replace(':poolComptrollerAddress', pool.comptrollerAddress)
                  .replace(':vTokenAddress', asset.vToken.address),
                search: `${TAB_PARAM_KEY}=repay`,
              },
            }),
          };

          userBlockingBorrowPositions.push(blockingBorrowPosition);
        }

        hypotheticalUserLiquidationThresholdCents += liquidationThresholdCents;
        hypotheticalUserBorrowLimitCents += borrowLimitCents;
        hypotheticalUserBorrowBalanceCents += borrowBalanceCents;
      });

      // Check if user is borrowing VAI
      if (
        pool.userVaiBorrowBalanceTokens &&
        pool.userVaiBorrowBalanceCents?.isGreaterThan(0) &&
        vai
      ) {
        const vaiBlockingBorrowPosition: BlockingBorrowPosition = {
          token: vai,
          userBorrowBalanceTokens: pool.userVaiBorrowBalanceTokens,
          userBorrowBalanceCents: pool.userVaiBorrowBalanceCents.toNumber(),
          to: formatTo({
            to: {
              pathname: routes.vai.path,
              search: `${TAB_PARAM_KEY}=repay`,
            },
          }),
        };

        userBlockingBorrowPositions.push(vaiBlockingBorrowPosition);
      }

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
        userBlockingBorrowPositions,
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

      const aCanBeEnabled = a.userBlockingBorrowPositions.length === 0 && a.userHasEnoughCollateral;
      const bCanBeEnabled = a.userBlockingBorrowPositions.length === 0 && a.userHasEnoughCollateral;

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
