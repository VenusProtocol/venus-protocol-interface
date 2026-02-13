import BigNumber from 'bignumber.js';
import { useGetAsset, useGetPool } from 'clients/api';
import {
  ButtonWrapper,
  CellGroup,
  type CellProps,
  Icon,
  Spinner,
  TokenIcon,
  Wrapper,
} from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  generateExplorerUrl,
} from 'utilities';
import type { Address } from 'viem';
import { AddTokenToWalletDropdown } from './AddTokenToWalletDropdown';
import { GoToTokenContractDropdown } from './GoToTokenContractDropdown';
import { UtilizationRate } from './UtilizationRate';

export const MarketInfo = () => {
  const { poolComptrollerAddress = NULL_ADDRESS, vTokenAddress = NULL_ADDRESS } = useParams<{
    poolComptrollerAddress: Address;
    vTokenAddress: Address;
  }>();

  const { t } = useTranslation();

  const { chainId } = useChainId();

  const { data: getAssetData } = useGetAsset({
    vTokenAddress,
  });
  const asset = getAssetData?.asset;

  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { data: getPools } = useGetPool({
    poolComptrollerAddress,
  });
  const pool = getPools?.pool;

  const cells: CellProps[] = useMemo(() => {
    const readableMaxLtvPercentage = asset
      ? formatPercentageToReadableValue(
          asset
            ? // We use BigNumber to prevent issues with floating-point numbers
              new BigNumber(asset.collateralFactor)
                .multipliedBy(100)
                .toNumber()
            : undefined,
        )
      : undefined;

    return [
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
        tooltip: t('layout.header.maxLtv.tooltip', {
          maxLtv: readableMaxLtvPercentage,
          userCollateralFactor: asset?.collateralFactor,
          tokenSymbol: asset?.vToken.underlyingToken.symbol,
        }),
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
        value: formatCentsToReadableValue({
          value: asset?.tokenPriceCents,
          shorten: false,
          maxDecimalPlaces: 6,
        }),
      },
    ];
  }, [asset, t, pool]);

  const oracleContractHref =
    asset &&
    generateExplorerUrl({
      hash: asset?.tokenPriceOracleAddress,
      chainId,
    });

  return (
    <div className="pb-6 sm:pb-5 md:pb-12 border-b-dark-blue-hover border-b">
      <Wrapper className="space-y-6 pt-6 sm:space-y-8">
        <div className="flex items-center min-h-8">
          {asset && pool ? (
            <div className="flex flex-col gap-y-3 sm:items-center sm:flex-row sm:justify-between sm:w-full md:w-auto md:gap-x-3">
              <div className="flex items-center gap-3">
                <TokenIcon token={asset.vToken.underlyingToken} className="h-full w-8 shrink-0" />

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-bold text-lg">{asset.vToken.underlyingToken.symbol}</span>
                </div>

                <AddTokenToWalletDropdown isUserConnected={isUserConnected} vToken={asset.vToken} />

                <GoToTokenContractDropdown vToken={asset.vToken} />
              </div>

              {oracleContractHref && (
                <ButtonWrapper
                  asChild
                  size="xs"
                  className="gap-x-2 inline-flex self-start shrink-0 bg-transparent text-blue"
                >
                  <Link noStyle href={oracleContractHref}>
                    <span>{t('layout.header.resilientOracle')}</span>

                    <Icon name="shield" />
                  </Link>
                </ButtonWrapper>
              )}
            </div>
          ) : (
            <Spinner className="h-full w-auto" />
          )}
        </div>

        <CellGroup
          cells={cells.map(cell => ({
            ...cell,
            className: 'p-0 bg-transparent',
          }))}
          variant="tertiary"
          className=""
        />
      </Wrapper>
    </div>
  );
};
