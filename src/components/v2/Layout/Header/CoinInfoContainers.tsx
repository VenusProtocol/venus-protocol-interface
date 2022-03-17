import React from 'react';
import { useVaiUser } from 'hooks/useVaiUser';
import { useMarketsUser } from 'hooks/useMarketsUser';
import { CoinInfo } from './CoinInfo';

export const XvsCoinInfo = () => {
  const { userVaiBalance } = useVaiUser();
  return <CoinInfo balance={userVaiBalance} coin="vai" />;
};

export const VaiCoinInfo = () => {
  const { userXvsBalance } = useMarketsUser();
  return <CoinInfo balance={userXvsBalance} coin="xvs" />;
};
