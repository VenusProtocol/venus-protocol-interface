import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  useGetLegacyPool,
  useGetTokenUsdPrice,
  useGetVaiRepayAmountWithInterests,
  useGetVaiRepayApr,
} from 'clients/api';
import { Spinner } from 'components';
import { AccountData, type AccountDataProps } from 'containers/AccountData';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import type { Asset } from 'types';
import { convertDollarsToCents, convertMantissaToTokens } from 'utilities';

export interface AccountVaiDataProps {
  amountTokens: string;
  action: AccountDataProps['action'];
}

export const AccountVaiData: React.FC<AccountVaiDataProps> = ({ amountTokens, action }) => {
  const { accountAddress } = useAccountAddress();

  const vai = useGetToken({
    symbol: 'VAI',
  })!;

  const { data: getVaiRepayAprData } = useGetVaiRepayApr();
  const borrowAprPercentage = getVaiRepayAprData?.repayAprPercentage;

  const { data: getVaiUsdPrice } = useGetTokenUsdPrice({
    token: vai,
  });
  const vaiPriceDollars = getVaiUsdPrice?.tokenPriceUsd;

  const { data: getLegacyPoolData } = useGetLegacyPool({
    accountAddress,
  });
  const legacyPool = getLegacyPoolData?.pool;

  const { data: repayAmountWithInterests } = useGetVaiRepayAmountWithInterests(
    {
      accountAddress: accountAddress || '',
    },
    {
      enabled: !!accountAddress,
    },
  );

  const userBorrowBalanceMantissa = repayAmountWithInterests?.vaiRepayAmountWithInterestsMantissa;

  const vaiAsset = useMemo(() => {
    if (!borrowAprPercentage || !userBorrowBalanceMantissa || !vaiPriceDollars) {
      return undefined;
    }

    const userBorrowBalanceTokens = convertMantissaToTokens({
      value: userBorrowBalanceMantissa,
      token: vai,
    });

    const vaiPriceCents = convertDollarsToCents(vaiPriceDollars);

    const userBorrowBalanceCents = userBorrowBalanceTokens.multipliedBy(vaiPriceCents);

    const asset: Asset = {
      vToken: {
        underlyingToken: vai,
        address: 'simulated-v-vai',
        // The following properties aren't relevant
        decimals: 8,
        symbol: '',
      },
      tokenPriceCents: vaiPriceCents,
      // Although this is technically incorrect (we're passing an APR to a property that expects an
      // APY), it is acceptable for the sake of calculating account health data
      borrowApyPercentage: borrowAprPercentage,
      supplyApyPercentage: new BigNumber(0),
      userBorrowBalanceTokens,
      userBorrowBalanceCents,
      userSupplyBalanceTokens: new BigNumber(0),
      userSupplyBalanceCents: new BigNumber(0),
      // The following properties aren't relevant, but still need to be added
      userWalletBalanceTokens: new BigNumber(0),
      userWalletBalanceCents: new BigNumber(0),
      userPercentOfLimit: 0,
      supplyDistributions: [],
      borrowDistributions: [],
      isCollateralOfUser: false,
      collateralFactor: 0,
      reserveFactor: 0,
      liquidityCents: new BigNumber(0),
      reserveTokens: new BigNumber(0),
      cashTokens: new BigNumber(0),
      exchangeRateVTokens: new BigNumber(0),
      supplierCount: 0,
      borrowerCount: 0,
      supplyBalanceTokens: new BigNumber(0),
      supplyBalanceCents: new BigNumber(0),
      borrowBalanceTokens: new BigNumber(0),
      borrowBalanceCents: new BigNumber(0),
      supplyPercentageRatePerBlock: new BigNumber(0),
      borrowPercentageRatePerBlock: new BigNumber(0),
    };

    return asset;
  }, [borrowAprPercentage, userBorrowBalanceMantissa, vai, vaiPriceDollars]);

  const legacyPoolWithVai = useMemo(
    () =>
      legacyPool &&
      vaiAsset && {
        ...legacyPool,
        assets: [...legacyPool.assets, vaiAsset],
      },
    [legacyPool, vaiAsset],
  );

  if (!vaiAsset || !legacyPoolWithVai) {
    return <Spinner />;
  }

  return (
    <AccountData
      showAssetInfo={false}
      asset={vaiAsset}
      pool={legacyPoolWithVai}
      amountTokens={new BigNumber(amountTokens || 0)}
      action={action}
      className="mb-6"
    />
  );
};
