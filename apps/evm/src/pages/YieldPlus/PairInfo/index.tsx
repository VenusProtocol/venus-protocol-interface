import BigNumber from 'bignumber.js';
import { useSearchParams } from 'react-router';

import { useGetPool } from 'clients/api';
import { Apy, CellGroup, type CellProps, TokenIcon } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useChain } from 'hooks/useChain';
import { useGetTokens } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { Asset, Token } from 'types';
import {
  areTokensEqual,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from '../constants';
import { useTokenPair } from '../useTokenPair';
import { TokenSelect } from './TokenSelect';

export const PairInfo: React.FC = () => {
  const { t } = useTranslation();
  const { corePoolComptrollerContractAddress } = useChain();
  const { shortToken, longToken } = useTokenPair();
  const [_, setSearchParams] = useSearchParams();
  const tokens = useGetTokens();

  const setLongToken = (newLongToken: Token) => {
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: newLongToken.address,
    }));
  };

  const setShortToken = (newShortToken: Token) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: newShortToken.address,
    }));

  const priceLongTokens = new BigNumber('0.02341'); // TODO: fetch
  const changePercentage = 3.32; // TODO: fetch

  const corePool = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
  });

  const { shortAsset, longAsset } = (corePool.data?.pool.assets || []).reduce<{
    shortAsset: Asset | undefined;
    longAsset: Asset | undefined;
  }>(
    (acc, asset) => {
      if (areTokensEqual(asset.vToken.underlyingToken, shortToken)) {
        acc.shortAsset = asset;
      }

      if (areTokensEqual(asset.vToken.underlyingToken, longToken)) {
        acc.longAsset = asset;
      }

      return acc;
    },
    {
      shortAsset: undefined,
      longAsset: undefined,
    },
  );

  const readablePriceLongTokens = priceLongTokens.dp(6).toFixed();
  const readableChangePercentage = formatPercentageToReadableValue(changePercentage);

  const cells: CellProps[] = [
    {
      label: t('yieldPlus.longLiquidity'),
      value: formatCentsToReadableValue({
        value: shortAsset?.liquidityCents,
      }),
    },
    {
      label: t('yieldPlus.shortLiquidity'),
      value: formatCentsToReadableValue({
        value: longAsset?.liquidityCents,
      }),
    },
    {
      label: t('yieldPlus.longSupplyApy', {
        longTokenSymbol: longToken.symbol,
      }),
      value: longAsset ? <Apy asset={longAsset} type="supply" /> : PLACEHOLDER_KEY,
    },
    {
      label: t('yieldPlus.shortBorrowApy', {
        shortTokenSymbol: shortToken.symbol,
      }),
      value: shortAsset ? <Apy asset={shortAsset} type="borrow" /> : PLACEHOLDER_KEY,
    },
  ];

  return (
    <div className="flex flex-col gap-y-6 lg:flex-col lg:p-4 lg:rounded-lg lg:border lg:border-dark-blue-hover">
      <div className="flex flex-col gap-3 sm:flex-row">
        <TokenSelect
          type="long"
          selectedToken={longToken}
          tokens={tokens}
          onChangeSelectedToken={setLongToken}
        />

        <TokenSelect
          type="short"
          selectedToken={shortToken}
          tokens={tokens}
          onChangeSelectedToken={setShortToken}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-6 md:flex-row md:justify-between md:items-start lg:flex lg:flex-col">
        <div className="flex items-center gap-x-3">
          <div className="flex items-center -space-x-2">
            <TokenIcon token={shortToken} className="size-8" />

            <TokenIcon token={longToken} className="size-8" />
          </div>

          <div className="flex flex-col">
            <p className="text-b1s">
              {shortToken.symbol}/{longToken.symbol}
            </p>

            <div className="flex items-center gap-x-1">
              <p className="text-p3s">{readablePriceLongTokens}</p>

              <p className="text-b1s text-green">{readableChangePercentage}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <CellGroup variant="secondary" cells={cells} />
        </div>
      </div>
    </div>
  );
};
