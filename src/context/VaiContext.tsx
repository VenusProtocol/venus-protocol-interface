import React, { useContext, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { getContractAddress } from 'utilities';
import {
  useComptrollerContract,
  useTokenContract,
  useVaiUnitrollerContract,
} from 'clients/contracts/hooks';
import useRefresh from 'hooks/useRefresh';
import { AuthContext } from './AuthContext';

export interface IVaiContextValue {
  userVaiMinted: BigNumber;
  userVaiBalance: BigNumber;
  userVaiEnabled: boolean;
  mintableVai: BigNumber;
}

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
  const { account } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;
    const update = async () => {
      if (!account) {
        return;
      }
      const [userVaiBalanceTemp, userVaiMintedTemp, { 1: mintableVaiTemp }, allowBalanceTemp] =
        await Promise.all([
          vaiContract.methods.balanceOf(account.address).call(),
          comptrollerContract.methods.mintedVAIs(account.address).call(),
          vaiControllerContract.methods.getMintableVAI(account.address).call(),
          vaiContract.methods
            .allowance(account.address, getContractAddress('vaiUnitroller'))
            .call(),
        ]);
      if (!isMounted) {
        return;
      }

      const formattedAllowBalanceTemp = new BigNumber(allowBalanceTemp);
      setMintedAmount(new BigNumber(userVaiMintedTemp).div(1e18));
      setWalletAmount(new BigNumber(userVaiBalanceTemp).div(1e18));
      setEnabled(
        formattedAllowBalanceTemp.gt(0) &&
          formattedAllowBalanceTemp.gte(new BigNumber(userVaiMintedTemp)),
      );
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
