import { useContext, useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { useGetDailyXvsWei } from 'clients/api';
import { convertWeiToCoins } from 'utilities/common';
import { Asset } from 'types';
import { XVS_TOKEN_ID } from 'constants/xvs';
import { AuthContext } from 'context/AuthContext';

export const useDailyXvsWei = ({ assets }: { assets: Asset[] }) => {
  const { account: { address: accountAddress = '' } = {} } = useContext(AuthContext);
  const { data: dailyXvsWei, isLoading: isGetDailyXvsLoading } = useGetDailyXvsWei(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const { dailyXvsDistributionInterestsCents } = useMemo(() => {
    const dailyXvsTokens =
      dailyXvsWei &&
      convertWeiToCoins({
        valueWei: dailyXvsWei,
        tokenId: XVS_TOKEN_ID,
      });
    const xvsAsset = assets.find((a: Asset) => a.id === XVS_TOKEN_ID);
    const xvsPriceDollars = xvsAsset?.tokenPrice || new BigNumber(0);
    return {
      dailyXvsDistributionInterestsCents: dailyXvsTokens?.multipliedBy(xvsPriceDollars).times(100),
    };
  }, [JSON.stringify(dailyXvsWei), accountAddress]);

  return {
    isLoading: isGetDailyXvsLoading,
    dailyXvsDistributionInterestsCents,
  };
};
