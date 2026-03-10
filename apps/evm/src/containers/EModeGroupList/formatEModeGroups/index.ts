import type { To } from 'react-router';

import { routes } from 'constants/routing';
import { TAB_PARAM_KEY } from 'hooks/useTabs';
import type { ChainId, EModeGroup, Pool, Token } from 'types';
import { areTokensEqual, calculateHealthFactor } from 'utilities';
import { getHypotheticalAssetValues } from '../getHypotheticalAssetValues';
import type { BlockingBorrowPosition, ExtendedEModeGroup } from '../types';

export const formatEModeGroups = ({
  pool,
  eModeGroups,
  searchValue,
  showUserAssetsOnly,
  formatTo,
  vai,
}: {
  pool: Pool;
  eModeGroups: EModeGroup[];
  searchValue: string;
  showUserAssetsOnly: boolean;
  formatTo: ({ to, chainId }: { to: To; chainId?: ChainId }) => To;
  vai?: Token;
}) =>
  eModeGroups
    .reduce<ExtendedEModeGroup[]>((acc, eModeGroup) => {
      // Filter out inactive E-mode groups, except the one enabled by the user
      if (!eModeGroup.isActive && eModeGroup.id !== pool.userEModeGroup?.id) {
        return acc;
      }

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

        let fallbackLiquidationThresholdPercentage = asset.liquidationThresholdPercentage;
        let fallbackCollateralFactor = asset.collateralFactor;

        if (eModeGroup.isIsolated) {
          fallbackLiquidationThresholdPercentage = 0;
          fallbackCollateralFactor = 0;
        }

        const { isBlocking, liquidationThresholdCents, borrowLimitCents, borrowBalanceCents } =
          getHypotheticalAssetValues({
            userSupplyBalanceCents: asset.userSupplyBalanceCents.toNumber(),
            userBorrowBalanceCents: asset.userBorrowBalanceCents.toNumber(),
            isCollateralOfUser: asset.isCollateralOfUser,
            isBorrowable: !!assetSettings?.isBorrowable,
            collateralFactor: assetSettings?.collateralFactor ?? fallbackCollateralFactor,
            liquidationThresholdPercentage:
              assetSettings?.liquidationThresholdPercentage ??
              fallbackLiquidationThresholdPercentage,
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
        pool.vai?.userBorrowBalanceTokens?.isGreaterThan(0) &&
        pool.vai.userBorrowBalanceCents &&
        vai
      ) {
        const vaiBlockingBorrowPosition: BlockingBorrowPosition = {
          token: vai,
          userBorrowBalanceTokens: pool.vai.userBorrowBalanceTokens,
          userBorrowBalanceCents: pool.vai.userBorrowBalanceCents.toNumber(),
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
        userHasEnoughCollateral,
        userBlockingBorrowPositions,
        hypotheticalUserHealthFactor,
      };

      // Handle search
      const searchMatches = (value: string) =>
        value.toLowerCase().includes(searchValue.toLowerCase());

      const { assetSettings } = eModeGroup;
      const groupNameMatches = searchMatches(eModeGroup.name);

      const filteredEModeAssetSettings = assetSettings.filter(settings => {
        const asset = pool.assets.find(a => areTokensEqual(settings.vToken, a.vToken));

        if (!asset) {
          return false;
        }

        // Handle user settings
        const hasUserAsset =
          asset.userSupplyBalanceCents.isGreaterThan(0) ||
          asset.userBorrowBalanceCents.isGreaterThan(0) ||
          asset.userWalletBalanceCents.isGreaterThan(0);

        const symbolMatches = searchMatches(settings.vToken.underlyingToken.symbol);
        const includeSearch = !searchValue || groupNameMatches || symbolMatches;

        const includeUserAsset = !showUserAssetsOnly || hasUserAsset;

        return includeSearch && includeUserAsset;
      });

      return filteredEModeAssetSettings.length > 0 ? [...acc, extendedEModeGroup] : acc;
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

      // Sort groups that can't be enabled last
      if (!aCanBeEnabled) {
        return 1;
      }
      if (!bCanBeEnabled) {
        return -1;
      }

      // Sort groups that can be enabled by hypothetical health factor, from highest to lowest
      return b.hypotheticalUserHealthFactor - a.hypotheticalUserHealthFactor;
    });
