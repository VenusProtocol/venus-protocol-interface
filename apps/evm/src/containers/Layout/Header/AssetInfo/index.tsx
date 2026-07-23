import BigNumber from 'bignumber.js';
import { useParams } from 'react-router';
import type { Address } from 'viem';

import { useGetAsset, useGetPool } from 'clients/api';
import { type CellProps, ProtectionModeIndicator } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import {
  areTokensEqual,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  scrollToElement,
} from 'utilities';
import { TokenInfo } from '../TokenInfo';
import { UtilizationRate } from './UtilizationRate';

export const AssetInfo = () => {
  const { poolComptrollerAddress = NULL_ADDRESS, vTokenAddress = NULL_ADDRESS } = useParams<{
    poolComptrollerAddress: Address;
    vTokenAddress: Address;
  }>();

  const { t, Trans } = useTranslation();

  const { accountAddress } = useAccountAddress();

  const { data: getAssetData } = useGetAsset({
    vTokenAddress,
    accountAddress,
  });
  const asset = getAssetData?.asset;
  const isUserConnected = !!accountAddress;

  const { data: getPools } = useGetPool({
    poolComptrollerAddress,
    accountAddress,
  });
  const pool = getPools?.pool;

  const hasModeInfo =
    !!asset &&
    !!pool?.eModeGroups.some(group =>
      group.assetSettings.some(s =>
        areTokensEqual(asset.vToken.underlyingToken, s.vToken.underlyingToken),
      ),
    );

  const scrollToLtvOptions = () => scrollToElement('mode-info');

  const effectiveCollateralFactor = isUserConnected
    ? asset?.userCollateralFactor
    : asset?.collateralFactor;

  const readableMaxLtvPercentage = asset
    ? formatPercentageToReadableValue(
        effectiveCollateralFactor !== undefined
          ? // We use BigNumber to prevent issues with floating-point numbers
            new BigNumber(effectiveCollateralFactor)
              .multipliedBy(100)
              .toNumber()
          : undefined,
      )
    : undefined;

  const readablePrice = formatCentsToReadableValue({
    value: asset?.tokenPriceCents,
    shorten: false,
    maxDecimalPlaces: 6,
  });

  const cells: CellProps[] = [
    {
      label: t('layout.header.supply'),
      value: formatCentsToReadableValue({
        value: asset?.supplyBalanceCents,
      }),
    },
    {
      label: t('layout.header.liquidity'),
      value: formatCentsToReadableValue({
        value: asset?.liquidityCents,
      }),
    },
    {
      label: t('layout.header.maxLtv.label'),
      value: readableMaxLtvPercentage,
      tooltip: (
        <div>
          <p>
            {t('layout.header.maxLtv.tooltip', {
              maxLtv: readableMaxLtvPercentage,
              userCollateralFactor: effectiveCollateralFactor,
              tokenSymbol: asset?.vToken.underlyingToken.symbol,
            })}
          </p>
          {hasModeInfo && (
            <p className="mt-2">
              <Trans
                i18nKey="layout.header.maxLtv.modeInfoHint"
                components={{
                  Link: (
                    <button
                      type="button"
                      className="text-blue underline cursor-pointer"
                      onClick={scrollToLtvOptions}
                    />
                  ),
                }}
              />
            </p>
          )}
        </div>
      ),
    },
    {
      label: t('layout.header.utilizationRate'),
      value:
        asset && pool ? (
          <UtilizationRate asset={asset} isIsolatedPoolMarket={pool.isIsolated} />
        ) : (
          PLACEHOLDER_KEY
        ),
    },
    {
      label: t('layout.header.price'),
      value: (
        <span className="inline-flex items-center gap-x-2">
          {asset?.isProtectionModeEnabled && (
            <ProtectionModeIndicator
              variant="icon"
              tokenName={asset.vToken.underlyingToken.symbol}
              tokenSupplyPriceCents={asset.tokenSupplyPriceCents}
              tokenBorrowPriceCents={asset.tokenBorrowPriceCents}
            />
          )}
          {readablePrice}
        </span>
      ),
    },
  ];

  const relatedTokens = asset && [asset.vToken.underlyingToken, asset.vToken];

  const protectionModeIndicator = asset?.isProtectionModeEnabled
    ? {
        tokenSupplyPriceCents: asset.tokenSupplyPriceCents,
        tokenBorrowPriceCents: asset.tokenBorrowPriceCents,
      }
    : undefined;

  return (
    <TokenInfo
      token={asset?.vToken.underlyingToken}
      tokenPriceOracleAddress={asset?.tokenPriceOracleAddress}
      relatedTokens={relatedTokens}
      protectionModeIndicator={protectionModeIndicator}
      cells={cells}
    />
  );
};
