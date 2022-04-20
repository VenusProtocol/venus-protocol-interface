import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { getVTokenContract } from 'clients/contracts';
import { Comptroller } from 'types/contracts';
import { VTokenId } from 'types';

export interface IGetVTokenDataInput {
  tokenId: VTokenId;
  tokenAddress: string;
  accountAddress: string;
  comptrollerContract: Comptroller;
  web3: Web3;
}

export interface IGetVTokenDataOutput {
  supplyStateIndex: string;
  borrowStateIndex: string;
  borrowBalanceStoredWei: BigNumber;
  borrowIndex: string;
  userBorrowIndex: string;
  userSupplyIndex: string;
  userBalanceWei: BigNumber;
}

export const getVTokenData = async ({
  tokenId,
  tokenAddress,
  accountAddress,
  comptrollerContract,
  web3,
}: IGetVTokenDataInput) => {
  const vTokenContract = getVTokenContract(tokenId, web3);

  const [
    supplyState,
    borrowState,
    userBorrowIndex,
    userSupplyIndex,
    tokenBorrowIndex,
    userBorrowBalanceStoredWei,
    userBalanceWei,
  ] = await Promise.all([
    comptrollerContract.methods.venusSupplyState(tokenAddress).call(),
    comptrollerContract.methods.venusBorrowState(tokenAddress).call(),
    comptrollerContract.methods.venusBorrowerIndex(tokenAddress, accountAddress).call(),
    comptrollerContract.methods.venusSupplierIndex(tokenAddress, accountAddress).call(),
    vTokenContract.methods.borrowIndex().call(),
    vTokenContract.methods.borrowBalanceStored(accountAddress).call(),
    vTokenContract.methods.balanceOf(accountAddress).call(),
  ]);

  // Format and return data
  return {
    supplyStateIndex: supplyState.index,
    borrowStateIndex: borrowState.index,
    userBorrowIndex,
    userSupplyIndex,
    tokenBorrowIndex,
    userBorrowBalanceStoredWei: new BigNumber(userBorrowBalanceStoredWei),
    userBalanceWei: new BigNumber(userBalanceWei),
  };
};

export default getVTokenData;
