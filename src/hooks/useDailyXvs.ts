import { useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { useGetVTokenDailyXvs } from 'clients/api';
import { convertWeiToCoins } from 'utilities/common';
import { Asset } from 'types';
import { XVS_TOKEN_ID } from 'constants/xvs';

export const useDailyXvs = ({
  accountAddress,
  assets,
}: {
  accountAddress?: string;
  assets: Asset[];
}) => {
  const { data: vTokenDailyXvsWei, isLoading } = useGetVTokenDailyXvs(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const { dailyXvsDistributionInterestsCents } = useMemo(() => {
    const dailyXvsTokens = convertWeiToCoins({
      valueWei: vTokenDailyXvsWei || new BigNumber(0),
      tokenId: XVS_TOKEN_ID,
    });
    const xvsAsset = assets.find((a: Asset) => a.id === 'xvs');
    const xvsPrice = xvsAsset?.tokenPrice || new BigNumber(0);
    return {
      dailyXvsDistributionInterestsCents: dailyXvsTokens.multipliedBy(xvsPrice).times(100),
    };
  }, [JSON.stringify(vTokenDailyXvsWei), accountAddress]);

  return {
    isLoading,
    dailyXvsDistributionInterestsCents,
  };
};
