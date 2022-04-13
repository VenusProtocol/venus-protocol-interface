import React, { useEffect, useState } from 'react';
import { useWeb3Account } from 'clients/web3';
import BigNumber from 'bignumber.js';
import { getContractAddress } from 'utilities';
import useRefresh from '../hooks/useRefresh';
import {
  useComptrollerContract,
  useTokenContract,
  useVaiUnitrollerContract,
} from '../clients/contracts/hooks';

const VaiContext = React.createContext({
  userVaiMinted: new BigNumber(0),
  userVaiBalance: new BigNumber(0),
  userVaiEnabled: false,
  mintableVai: new BigNumber(0),
});

// This context provide a way for all the components to share the market data, thus avoid
// duplicated requests

const VaiContextProvider = ({ children }: $TSFixMe) => {
  const [userVaiMinted, setMintedAmount] = useState(new BigNumber(0));
  const [userVaiBalance, setWalletAmount] = useState(new BigNumber(0));
  const [userVaiEnabled, setEnabled] = useState(false);
  const [mintableVai, setMintableAmount] = useState(new BigNumber(0));

  const { fastRefresh } = useRefresh();
  const comptrollerContract = useComptrollerContract();
  const vaiControllerContract = useVaiUnitrollerContract();
  const vaiContract = useTokenContract('vai');
  const { account } = useWeb3Account();

  useEffect(() => {
    let isMounted = true;
    const update = async () => {
      if (!account) {
        return;
      }
      const [userVaiBalanceTemp, userVaiMintedTemp, { 1: mintableVaiTemp }, allowBalanceTemp] =
        await Promise.all([
          vaiContract.methods.balanceOf(account).call(),
          comptrollerContract.methods.mintedVAIs(account).call(),
          vaiControllerContract.methods.getMintableVAI(account).call(),
          vaiContract.methods.allowance(account, getContractAddress('vaiUnitroller')).call(),
        ]);
      if (!isMounted) {
        return;
      }
      setMintedAmount(new BigNumber(userVaiMintedTemp).div(1e18));
      setWalletAmount(new BigNumber(userVaiBalanceTemp).div(1e18));
      setEnabled(new BigNumber(allowBalanceTemp).gte(new BigNumber(userVaiMintedTemp)));
      setMintableAmount(new BigNumber(mintableVaiTemp).div(1e18));
    };
    update();
    return () => {
      isMounted = false;
    };
  }, [fastRefresh, vaiControllerContract, vaiContract, comptrollerContract, account]);

  return (
    <VaiContext.Provider
      value={{
        userVaiMinted,
        userVaiBalance,
        userVaiEnabled,
        mintableVai,
      }}
    >
      {children}
    </VaiContext.Provider>
  );
};

export { VaiContext, VaiContextProvider };
