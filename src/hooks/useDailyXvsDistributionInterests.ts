import { BigNumber } from 'bignumber.js';
import { useContext, useMemo } from 'react';
import { convertWeiToTokens } from 'utilities';

import { useGetDailyXvs, useGetMarkets } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

const useDailyXvsDistributionInterests = () => {
  const { account } = useContext(AuthContext);
  const { data: getDailyXvsData, isLoading: isGetDailyXvsLoading } = useGetDailyXvs(
    { accountAddress: account?.address || '' },
    { enabled: !!account?.address },
  );

  const { data: getMarketsData, isLoading: isGetMarketsLoading } = useGetMarkets();
  const xvsPriceDollars: BigNumber | undefined = useMemo(
    () =>
      (getMarketsData?.markets || []).find(
        market => market.address.toLowerCase() === TOKENS.xvs.address.toLowerCase(),
      )?.tokenPrice,
    [JSON.stringify(getMarketsData?.markets)],
  );

  const { dailyXvsDistributionInterestsCents } = useMemo(() => {
    const dailyXvsTokens =
      getDailyXvsData &&
      convertWeiToTokens({
        valueWei: getDailyXvsData.dailyXvsWei,
        token: TOKENS.xvs,
      });

    return {
      dailyXvsDistributionInterestsCents:
        account?.address && xvsPriceDollars
          ? dailyXvsTokens?.multipliedBy(xvsPriceDollars).times(100)
          : new BigNumber(0),
    };
  }, [
    JSON.stringify(getDailyXvsData?.dailyXvsWei),
    JSON.stringify(getMarketsData?.markets),
    account?.address,
  ]);

  return {
    isLoading: isGetDailyXvsLoading || isGetMarketsLoading,
    dailyXvsDistributionInterestsCents,
  };
};

export default useDailyXvsDistributionInterests;
