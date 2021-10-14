import { useCallback, useEffect, useState } from 'react';
import useRefresh from './useRefresh';
import { useComptroller, useVaiToken, useVaiUnitroller } from './useContract';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { getVaiUnitrollerAddress } from '../utilities/addressHelpers';
import { methods } from '../utilities/ContractService';

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
      methods.call(vaiContract.methods.balanceOf, [account]),
      methods.call(comptrollerContract.methods.mintedVAIs, [account]),
      methods.call(vaiControllerContract.methods.getMintableVAI, [account]),
      methods.call(vaiContract.methods.allowance, [
        account,
        getVaiUnitrollerAddress()
      ])
    ]);
    userVaiBalance = new BigNumber(userVaiBalance).div(
      new BigNumber(10).pow(18)
    );
    userVaiMinted = new BigNumber(userVaiMinted).div(
      new BigNumber(10).pow(18)
    );
    mintableVai = new BigNumber(mintableVai).div(new BigNumber(10).pow(18));
    allowBalance = new BigNumber(allowBalance).div(new BigNumber(10).pow(18));

    setMintedAmount(userVaiMinted);
    setWalletAmount(userVaiBalance);
    setEnabled(allowBalance.gte(userVaiMinted));
    setMintableAmount(mintableVai);
  }, [vaiControllerContract, vaiContract, comptrollerContract, account]);

  useEffect(() => {
    updateVaiInfo();
  }, [fastRefresh]);

  return { userVaiMinted,
    userVaiBalance,
    userVaiEnabled,
    mintableVai };
};
