import { type ChainId, chains, getToken } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';

import type { TopMarketItem } from 'clients/api/queries/getTopMarkets/type';
import type { TableColumn } from 'components';
import { TokenChainIconWithSymbol } from 'components/TokenChainIconWithSymbol';
import { useTranslation } from 'libs/translations';
import {
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import VenusPrime from './assets/venusPrime.svg?react';

export const useColumns = () => {
  const { t } = useTranslation();

  const columns = [
    {
      key: 'underlyingSymbol',
      label: t('landing.markets.asset'),
      selectOptionLabel: 'Asset',
      renderCell: ({ underlyingSymbol, chainId }) => {
        const token = getToken({
          symbol: underlyingSymbol,
          chainId: chainId as unknown as ChainId,
        });

        const chain = chains[chainId as unknown as ChainId];
        return token ? <TokenChainIconWithSymbol token={token} chain={chain} /> : null;
      },
    },
    {
      key: 'totalSupplyUnderlyingCents',
      label: t('landing.markets.marketSize'),
      selectOptionLabel: 'totalSupplyUnderlyingCents',
      align: 'right',
      renderCell: ({ totalSupplyUnderlyingCents }) => (
        <div className="text-light-grey-active">
          {formatCentsToReadableValue({ value: totalSupplyUnderlyingCents })}
        </div>
      ),
    },
    {
      key: 'supplyApy',
      label: t('landing.markets.supplyApy'),
      selectOptionLabel: 'supplyApy',
      align: 'right',
      renderCell: ({
        supplyApy,
        estimatedPrimeSupplyApyBoost /* TODO: not this value, waiting for BE to add a correct one */,
      }) => (
        <div className="flex justify-end items-center gap-2 text-end">
          <div className="text-light-grey-active">{formatPercentageToReadableValue(supplyApy)}</div>
          {estimatedPrimeSupplyApyBoost ? (
            <div className="w-fit flex items-center gap-1 border border-solid border-dark-blue-hover rounded-[300px] px-1">
              <VenusPrime className="size-10" />
              <div className="bg-linear-[26deg,#674031_-49.72%,#FFECE3_85.68%,#6D4637_221.08%,#FFECE3_383.56%] bg-clip-text text-transparent">
                {formatPercentageToReadableValue(estimatedPrimeSupplyApyBoost)}
              </div>
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: 'borrowApy',
      label: t('landing.markets.borrowApy'),
      selectOptionLabel: 'borrowApy',
      align: 'right',
      renderCell: ({ borrowApy }) => (
        <div className="text-light-grey-active">{formatPercentageToReadableValue(borrowApy)}</div>
      ),
    },
    {
      key: 'liquidity',
      label: t('landing.markets.liquidity'),
      selectOptionLabel: 'liquidity',
      align: 'right',
      renderCell: ({ liquidityCents, underlyingTokenMetadata, underlyingSymbol, chainId }) => {
        const token = getToken({
          symbol: underlyingSymbol,
          chainId: chainId as unknown as ChainId,
        });

        const priceMantissaBN = new BigNumber(
          underlyingTokenMetadata?.[0]?.tokenPrices?.[0]?.priceMantissa,
        );

        const volume =
          priceMantissaBN.isZero() || priceMantissaBN.isNaN()
            ? undefined
            : new BigNumber(liquidityCents).shiftedBy(-2).div(
                convertMantissaToTokens({
                  value: priceMantissaBN,
                  token,
                }),
              );

        return (
          <div className="text-end">
            <div className="text-light-grey-active">
              {formatTokensToReadableValue({ value: volume, token })}
            </div>
            <div className="text-light-grey">
              {formatCentsToReadableValue({ value: liquidityCents })}
            </div>
          </div>
        );
      },
    },
  ] as TableColumn<TopMarketItem>[];

  return {
    columns,
  }
};
