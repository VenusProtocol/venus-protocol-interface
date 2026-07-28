import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useSearchParams } from 'react-router';

import { AssetApy, CellGroup, type CellProps, Icon } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import type { OptionalTokenBalance } from 'containers/TokenListWrapper';
import { useTranslation } from 'libs/translations';
import type { Asset, Token } from 'types';
import {
  areTokensEqual,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import { TokenPair } from '../TokenPair';
import {
  LONG_TOKEN_ADDRESS_PARAM_KEY,
  PRICE_DECIMALS,
  SHORT_TOKEN_ADDRESS_PARAM_KEY,
} from '../constants';
import { useGetTradeAssets } from '../useGetTradeAssets';
import { useTokenPair } from '../useTokenPair';
import { TokenSelect } from './TokenSelect';

export interface PairInfoProps {
  changePercentage?: number;
  priceCentsRatio?: BigNumber;
}

export const PairInfo: React.FC<PairInfoProps> = ({ changePercentage, priceCentsRatio }) => {
  const { t } = useTranslation();
  const { shortToken, longToken } = useTokenPair();
  const [_, setSearchParams] = useSearchParams();

  const setLongToken = (newLongToken: Token) => {
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: newLongToken.address,
      // Prevent short and long tokens from being the same
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: areTokensEqual(shortToken, newLongToken)
        ? longToken.address
        : shortToken.address,
    }));
  };

  const setShortToken = (newShortToken: Token) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: newShortToken.address,
      // Prevent short and long tokens from being the same
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: areTokensEqual(longToken, newShortToken)
        ? shortToken.address
        : longToken.address,
    }));

  const switchSelectedTokens = () =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: longToken.address,
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: shortToken.address,
    }));

  const {
    data: { borrowAssets, supplyAssets },
  } = useGetTradeAssets();

  const { longAsset, longTokenBalances } = supplyAssets.reduce<{
    longAsset?: Asset;
    longTokenBalances: OptionalTokenBalance[];
  }>(
    (acc, asset) => {
      if (areTokensEqual(asset.vToken.underlyingToken, longToken)) {
        acc.longAsset = asset;
      }

      const tokenBalance: OptionalTokenBalance = {
        token: asset.vToken.underlyingToken,
        isDeemed: asset.disabledTokenActions.includes('supply'),
        isGated: asset.isGated,
      };

      return {
        ...acc,
        longTokenBalances: [...acc.longTokenBalances, tokenBalance],
      };
    },
    {
      longAsset: undefined,
      longTokenBalances: [],
    },
  );

  const { shortAsset, shortTokenBalances } = borrowAssets.reduce<{
    shortAsset?: Asset;
    shortTokenBalances: OptionalTokenBalance[];
  }>(
    (acc, asset) => {
      if (areTokensEqual(asset.vToken.underlyingToken, shortToken)) {
        acc.shortAsset = asset;
      }

      const tokenBalance: OptionalTokenBalance = {
        token: asset.vToken.underlyingToken,
        isDeemed: asset.disabledTokenActions.includes('borrow') || !asset.isBorrowable,
        isGated: asset.isGated,
      };

      return {
        ...acc,
        shortTokenBalances: [...acc.shortTokenBalances, tokenBalance],
      };
    },
    {
      shortAsset: undefined,
      shortTokenBalances: [],
    },
  );

  const readableDollarRatio = priceCentsRatio
    ?.dp(PRICE_DECIMALS, BigNumber.ROUND_HALF_CEIL)
    .toFixed();

  const readableChangePercentage =
    changePercentage !== undefined ? formatPercentageToReadableValue(changePercentage) : undefined;

  const cells: CellProps[] = [
    {
      label: t('trade.longLiquidity'),
      value: formatCentsToReadableValue({
        value: longAsset?.liquidityCents,
      }),
    },
    {
      label: t('trade.shortLiquidity'),
      value: formatCentsToReadableValue({
        value: shortAsset?.liquidityCents,
      }),
    },
    {
      label: t('trade.longSupplyApy', {
        longTokenSymbol: longToken.symbol,
      }),
      value: longAsset ? (
        <AssetApy asset={longAsset} type="supply" showPrimeSimulation={false} />
      ) : (
        PLACEHOLDER_KEY
      ),
    },
    {
      label: t('trade.shortBorrowApy', {
        shortTokenSymbol: shortToken.symbol,
      }),
      value: shortAsset ? (
        <AssetApy asset={shortAsset} type="borrow" showPrimeSimulation={false} />
      ) : (
        PLACEHOLDER_KEY
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-y-6 lg:p-4 lg:rounded-lg lg:border lg:border-dark-blue-hover">
      <div className="flex flex-col gap-3 sm:flex-row">
        <TokenSelect
          type="long"
          selectedToken={longToken}
          tokenBalances={longTokenBalances}
          onChangeSelectedToken={setLongToken}
          data-testid="pair-info-long-token-select"
        />

        <TokenSelect
          type="short"
          selectedToken={shortToken}
          tokenBalances={shortTokenBalances}
          onChangeSelectedToken={setShortToken}
          data-testid="pair-info-short-token-select"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-6 md:flex-row md:justify-between lg:flex-col 2xl:flex-row">
        <div className="flex items-center gap-x-2">
          <TokenPair
            shortToken={shortToken}
            longToken={longToken}
            isLongProtected={longAsset?.isProtectionModeEnabled}
            isShortProtected={shortAsset?.isProtectionModeEnabled}
            size="md"
          />

          <div className="flex items-center gap-x-2">
            {readableDollarRatio && <p className="text-p3s">{readableDollarRatio}</p>}

            {readableChangePercentage && (
              <p
                className={cn(
                  'text-b1s',
                  changePercentage === undefined || changePercentage >= 0
                    ? 'text-green'
                    : 'text-red',
                )}
              >
                {readableChangePercentage}
              </p>
            )}
          </div>

          <button
            type="button"
            className="cursor-pointer text-light-grey hover:text-blue"
            onClick={switchSelectedTokens}
            data-testid="pair-info-switch-tokens-button"
          >
            <Icon name="swap" className="text-inherit transition-colors" />
          </button>
        </div>

        <div className="overflow-hidden">
          <CellGroup cells={cells} />
        </div>
      </div>
    </div>
  );
};
