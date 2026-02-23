import { useSearchParams } from 'react-router';

import { Page } from 'components';
import { useEffect } from 'react';
import { Banner } from './Banner';
import { store } from './Banner/store';
import { PairInfo } from './PairInfo';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from './constants';
import { useTokenPair } from './useTokenPair';

const YieldPlus: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { shortToken, longToken } = useTokenPair();

  const shortTokenAddress = searchParams.get(SHORT_TOKEN_ADDRESS_PARAM_KEY);
  const longTokenAddress = searchParams.get(LONG_TOKEN_ADDRESS_PARAM_KEY);

  const doNotShowBanner = store.use.doNotShowBanner();

  // Update token search params if they are empty or incorrect
  useEffect(() => {
    if (shortToken.address !== shortTokenAddress || longToken.address !== longTokenAddress) {
      setSearchParams(
        currentSearchParams => ({
          ...Object.fromEntries(currentSearchParams),
          [SHORT_TOKEN_ADDRESS_PARAM_KEY]: String(shortToken.address),
          [LONG_TOKEN_ADDRESS_PARAM_KEY]: String(longToken.address),
        }),
        {
          replace: true,
        },
      );
    }
  }, [shortToken, longToken, longTokenAddress, shortTokenAddress, setSearchParams]);

  return (
    <Page>
      <div className="flex flex-col gap-y-6 lg:grid lg:grid-cols-[6fr_4fr] lg:gap-6 xl:grid-cols-[8fr_4fr]">
        <PairInfo />

        {!doNotShowBanner && <Banner />}
      </div>
    </Page>
  );
};

export default YieldPlus;
