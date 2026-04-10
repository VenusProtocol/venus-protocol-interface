import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { Card, KLineChart, Page, Spinner } from 'components';
import { ONE_DAY_MS } from 'constants/time';
import { areAddressesEqual } from 'utilities';
import { Banner } from './Banner';
import { store } from './Banner/store';
import { OperationForm } from './OperationForm';
import { PairInfo } from './PairInfo';
import { Positions } from './Positions';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from './constants';
import { useGetLiveKLineCandles } from './useGetLiveKLineCandles';
import { useGetYieldPlusAssets } from './useGetYieldPlusAssets';
import { useTokenPair } from './useTokenPair';

const YieldPlus: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { shortToken, longToken, defaultLongToken, defaultShortToken } = useTokenPair();
  const shortTokenAddressParam = searchParams.get(SHORT_TOKEN_ADDRESS_PARAM_KEY);
  const longTokenAddressParam = searchParams.get(LONG_TOKEN_ADDRESS_PARAM_KEY);

  const doNotShowBanner = store.use.doNotShowBanner();

  const {
    data: { borrowAssets, supplyAssets },
    isLoading: isGetYieldPlusAssetsLoading,
  } = useGetYieldPlusAssets();

  const longAsset = longTokenAddressParam
    ? supplyAssets.find(asset =>
        areAddressesEqual(asset.vToken.underlyingToken.address, longTokenAddressParam),
      )
    : undefined;

  const shortAsset = shortTokenAddressParam
    ? borrowAssets.find(asset =>
        areAddressesEqual(asset.vToken.underlyingToken.address, shortTokenAddressParam),
      )
    : undefined;

  const { changePercentage, dataLoader, priceCentsRatio } = useGetLiveKLineCandles({
    baseToken: longToken,
    quoteToken: shortToken,
    baseTokenPriceCents: longAsset?.tokenPriceCents,
    quoteTokenPriceCents: shortAsset?.tokenPriceCents,
    rangeMs: ONE_DAY_MS,
  });

  const isLoading = isGetYieldPlusAssetsLoading;

  // Update token search params if they are empty or incorrect
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (
      !longAsset?.vToken.address ||
      !shortAsset?.vToken.address ||
      !longTokenAddressParam ||
      !shortTokenAddressParam ||
      areAddressesEqual(longTokenAddressParam, shortTokenAddressParam)
    ) {
      setSearchParams(
        currentSearchParams => ({
          ...Object.fromEntries(currentSearchParams),
          [SHORT_TOKEN_ADDRESS_PARAM_KEY]: String(defaultShortToken.address),
          [LONG_TOKEN_ADDRESS_PARAM_KEY]: String(defaultLongToken.address),
        }),
        {
          replace: true,
        },
      );
      return;
    }
  }, [
    isLoading,
    longAsset?.vToken.address,
    shortAsset?.vToken.address,
    shortTokenAddressParam,
    longTokenAddressParam,
    defaultLongToken,
    defaultShortToken,
    setSearchParams,
  ]);

  return (
    <Page>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-y-6 lg:grid lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] lg:gap-6 xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <div className="min-w-0 flex flex-col gap-y-6">
            <PairInfo changePercentage={changePercentage} priceCentsRatio={priceCentsRatio} />

            {!doNotShowBanner && <Banner className="lg:hidden" />}

            <Card className="p-0 overflow-hidden bg-dark-blue h-80 shrink-0 lg:h-114">
              <KLineChart
                dataLoader={dataLoader}
                title={`${longToken.symbol}/${shortToken.symbol}`}
              />
            </Card>

            <Positions className="hidden lg:block" />
          </div>

          <div className="min-w-0 flex flex-col gap-y-6 relative overflow-hidden lg:self-start">
            {!doNotShowBanner && <Banner className="hidden lg:flex" />}

            <Card className="border-blue bg-dark-blue p-6">
              <OperationForm />
            </Card>

            <Positions className="lg:hidden" />
          </div>
        </div>
      )}
    </Page>
  );
};

export default YieldPlus;
