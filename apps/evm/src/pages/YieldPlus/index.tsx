import { useSearchParams } from 'react-router';

import { Card, KLineChart, Page, Spinner } from 'components';
import { useEffect } from 'react';
import { areAddressesEqual } from 'utilities';
import { Banner } from './Banner';
import { store } from './Banner/store';
import { OperationForm } from './OperationForm';
import { PairInfo } from './PairInfo';
import { Positions } from './Positions';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from './constants';
import { useGetYieldPlusAssets } from './useGetYieldPlusAssets';
import { useTokenPair } from './useTokenPair';

const kLineChartData = [
  // TODO: fetch
  {
    timestamp: 1517846400000,
    open: 7424.6,
    high: 7511.3,
    low: 6032.3,
    close: 7310.1,
    volume: 224461,
  },
  {
    timestamp: 1517932800000,
    open: 7310.1,
    high: 8499.9,
    low: 6810,
    close: 8165.4,
    volume: 148807,
  },
  {
    timestamp: 1518019200000,
    open: 8166.7,
    high: 8700.8,
    low: 7400,
    close: 8245.1,
    volume: 24467,
  },
  {
    timestamp: 1518105600000,
    open: 8244,
    high: 8494,
    low: 7760,
    close: 8364,
    volume: 29834,
  },
  {
    timestamp: 1518192000000,
    open: 8363.6,
    high: 9036.7,
    low: 8269.8,
    close: 8311.9,
    volume: 28203,
  },
  {
    timestamp: 1518278400000,
    open: 8301,
    high: 8569.4,
    low: 7820.2,
    close: 8426,
    volume: 59854,
  },
  {
    timestamp: 1518364800000,
    open: 8426,
    high: 8838,
    low: 8024,
    close: 8640,
    volume: 54457,
  },
  {
    timestamp: 1518451200000,
    open: 8640,
    high: 8976.8,
    low: 8360,
    close: 8500,
    volume: 51156,
  },
  {
    timestamp: 1518537600000,
    open: 8504.9,
    high: 9307.3,
    low: 8474.3,
    close: 9307.3,
    volume: 49118,
  },
  {
    timestamp: 1518624000000,
    open: 9307.3,
    high: 9897,
    low: 9182.2,
    close: 9774,
    volume: 48092,
  },
];

const YieldPlus: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: { borrowAssets, supplyAssets },
    isLoading,
  } = useGetYieldPlusAssets();

  const { shortToken, longToken, defaultLongToken, defaultShortToken } = useTokenPair();
  const shortTokenAddressParam = searchParams.get(SHORT_TOKEN_ADDRESS_PARAM_KEY);
  const longTokenAddressParam = searchParams.get(LONG_TOKEN_ADDRESS_PARAM_KEY);

  const doNotShowBanner = store.use.doNotShowBanner();

  // Update token search params if they are empty or incorrect
  useEffect(() => {
    if (isLoading) {
      return;
    }

    const longAsset =
      longTokenAddressParam &&
      supplyAssets.find(asset =>
        areAddressesEqual(asset.vToken.underlyingToken.address, longTokenAddressParam),
      );

    const shortAsset =
      shortTokenAddressParam &&
      borrowAssets.find(asset =>
        areAddressesEqual(asset.vToken.underlyingToken.address, shortTokenAddressParam),
      );

    if (!longAsset || !shortAsset) {
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
    }
  }, [
    isLoading,
    shortTokenAddressParam,
    longTokenAddressParam,
    borrowAssets,
    supplyAssets,
    defaultLongToken,
    defaultShortToken,
    setSearchParams,
  ]);

  return (
    <Page>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-y-6 lg:grid lg:grid-cols-[6fr_4fr] lg:gap-6 xl:grid-cols-[8fr_4fr]">
          <div className="flex flex-col gap-y-6">
            <PairInfo />

            {!doNotShowBanner && <Banner className="lg:hidden" />}

            <Card className="p-0 overflow-hidden bg-dark-blue h-80 shrink-0 lg:h-114">
              <KLineChart
                title={`${longToken.symbol}/${shortToken.symbol}`}
                data={kLineChartData}
              />
            </Card>

            <Positions className="hidden lg:block" />
          </div>

          <div className="flex flex-col gap-y-6 lg:self-start">
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
