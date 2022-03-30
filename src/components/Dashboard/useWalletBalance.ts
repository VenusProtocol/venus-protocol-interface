import { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import { useVaiUser } from '../../hooks/useVaiUser';
import { useMarketsUser } from '../../hooks/useMarketsUser';
import { useWeb3Account } from '../../clients/web3';
import { useVaiVault } from '../../hooks/useContract';
import { getBigNumber } from '../../utilities/common';
import { Setting } from '../../types';

export interface WalletBalanceProps {
  settings: Setting;
  setSetting: (setting: Partial<Setting> | undefined) => void;
}

const format = commaNumber.bindWith(',', '.');

export const useWalletBalance = ({ settings, setSetting }: WalletBalanceProps) => {
  const [netAPY, setNetAPY] = useState(0);
  const [withXVS, setWithXVS] = useState(true);
  const { userVaiMinted } = useVaiUser();
  const { userMarketInfo } = useMarketsUser();

  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [totalBorrow, setTotalBorrow] = useState(new BigNumber(0));
  const { account } = useWeb3Account();
  const vaultContract = useVaiVault();

  let isMounted = true;

  const addVAIApy = useCallback(
    async apy => {
      if (!account) {
        return;
      }
      const { 0: staked } = await vaultContract.methods.userInfo(account).call();
      const amount = new BigNumber(staked).div(1e18);

      if (!isMounted) {
        return;
      }

      if (amount.isNaN() || amount.isZero()) {
        setNetAPY(apy.dp(2, 1).toNumber());
      } else {
        setNetAPY(apy.plus(settings.vaiAPY).dp(2, 1).toNumber());
      }
    },
    [settings],
  );

  const updateNetAPY = useCallback(async () => {
    let totalSum = new BigNumber(0);
    let totalSupplied = new BigNumber(0);
    let totalBorrowed = userVaiMinted;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type '{}'.
    userMarketInfo.forEach((asset: Asset) => {
      if (!asset) return;
      const {
        supplyBalance,
        borrowBalance,
        tokenPrice,
        supplyApy,
        borrowApy,
        xvsSupplyApy,
        xvsBorrowApy,
      } = asset;
      const supplyBalanceUSD = getBigNumber(supplyBalance).times(getBigNumber(tokenPrice));
      const borrowBalanceUSD = getBigNumber(borrowBalance).times(getBigNumber(tokenPrice));
      totalSupplied = totalSupplied.plus(supplyBalanceUSD);
      totalBorrowed = totalBorrowed.plus(borrowBalanceUSD);

      const supplyApyWithXVS = withXVS
        ? getBigNumber(supplyApy).plus(getBigNumber(xvsSupplyApy))
        : getBigNumber(supplyApy);
      const borrowApyWithXVS = withXVS
        ? getBigNumber(xvsBorrowApy).plus(getBigNumber(borrowApy))
        : getBigNumber(borrowApy);

      // const supplyApyWithXVS = getBigNumber(supplyApy);
      // const borrowApyWithXVS = getBigNumber(borrowApy).times(-1);
      totalSum = totalSum.plus(
        supplyBalanceUSD
          .times(supplyApyWithXVS.div(100))
          .plus(borrowBalanceUSD.times(borrowApyWithXVS.div(100))),
      );
    });

    let apy;

    if (totalSum.isZero() || totalSum.isNaN()) {
      apy = new BigNumber(0);
    } else if (totalSum.isGreaterThan(0)) {
      apy = totalSupplied.isZero() ? 0 : totalSum.div(totalSupplied).times(100);
    } else {
      apy = totalBorrowed.isZero() ? 0 : totalSum.div(totalBorrowed).times(100);
    }
    if (!isMounted) {
      return;
    }
    setTotalSupply(totalSupplied);
    setTotalBorrow(totalBorrowed);
    addVAIApy(apy);
  }, [userMarketInfo, withXVS]);

  useEffect(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'length' does not exist on type '{}'.
    if (account && userMarketInfo && userMarketInfo.length > 0) {
      updateNetAPY();
    }
    return () => {
      isMounted = false;
    };
  }, [account, updateNetAPY]);

  useEffect(() => {
    if (isMounted) {
      setSetting({
        withXVS,
      });
    }
    return () => {
      isMounted = false;
    };
  }, [withXVS]);

  const formatValue = (value: $TSFixMe) => `$${format(getBigNumber(value).dp(2, 1).toString(10))}`;

  return {
    totalSupply,
    formatValue,
    netAPY,
    withXVS,
    setWithXVS,
    totalBorrow,
  };
};
