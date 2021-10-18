import { useCallback, useEffect, useState } from 'react';
import useRefresh from './useRefresh';
import { useComptroller, useVaiToken, useVaiUnitroller } from './useContract';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { getVaiUnitrollerAddress } from '../utilities/addressHelpers';

export const useVaiUser = () => {
  const [userVaiMinted, setMintedAmount] = useState(new BigNumber(0));
  const [userVaiBalance, setWalletAmount] = useState(new BigNumber(0));
  const [userVaiEnabled, setEnabled] = useState(false);
  const [mintableVai, setMintableAmount] = useState(new BigNumber(0));

  const { fastRefresh } = useRefresh();
  const comptrollerContract = useComptroller();
  const vaiControllerContract = useVaiUnitroller();
  const vaiContract = useVaiToken();
  const { account } = useWeb3React();

  const updateVaiInfo = useCallback(async () => {
    let [
      userVaiBalance,
      userVaiMinted,
      { 1: mintableVai },
      allowBalance
    ] = await Promise.all([
      vaiContract.methods.balanceOf(account).call(),
      comptrollerContract.methods.mintedVAIs(account).call(),
      vaiControllerContract.methods.getMintableVAI(account).call(),
      vaiContract.methods.allowance(account, getVaiUnitrollerAddress()).call()
    ]);
    userVaiBalance = new BigNumber(userVaiBalance).div(1e18);
    userVaiMinted = new BigNumber(userVaiMinted).div(1e18);
    mintableVai = new BigNumber(mintableVai).div(1e18);
    allowBalance = new BigNumber(allowBalance).div(1e18);

    setMintedAmount(userVaiMinted);
    setWalletAmount(userVaiBalance);
    setEnabled(allowBalance.gte(userVaiMinted));
    setMintableAmount(mintableVai);
  }, [vaiControllerContract, vaiContract, comptrollerContract, account]);

  useEffect(() => {
    if (account) {
      updateVaiInfo();
    }
  }, [fastRefresh, account]);

  return { userVaiMinted, userVaiBalance, userVaiEnabled, mintableVai };
};
