import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { VTokenId } from 'types';
import { getVTokenContract } from 'clients/contracts';
import { VBEP_TOKENS } from 'constants/tokens';
import { Comptroller } from 'types/contracts';

// @TODO: add tests

export interface IGetXvsRewardInput {
  web3: Web3;
  accountAddress: string;
  comptrollerContract: Comptroller;
  venusInitialIndex: number;
  xvsAccrued: BigNumber;
  vaiMintIndex: number;
  userVaiMintIndex: number;
  userMintedVai: BigNumber;
}

export type GetXvsRewardOutput = BigNumber;

const getXvsReward = async ({
  web3,
  accountAddress,
  comptrollerContract,
  venusInitialIndex,
  xvsAccrued,
  vaiMintIndex,
  userVaiMintIndex,
  userMintedVai,
}: IGetXvsRewardInput): Promise<GetXvsRewardOutput> => {
  const getXvsRewardSingleToken = async (vTokenId: VTokenId, vTokenAddress: string) => {
    const vTokenContract = getVTokenContract(vTokenId, web3);

    const [
      supplyState,
      supplierTokens,
      borrowState,
      borrowerIndex,
      borrowBalanceStored,
      borrowIndex,
      supplierIndex,
    ] = await Promise.all([
      comptrollerContract.methods.venusSupplyState(vTokenAddress).call(),
      vTokenContract.methods.balanceOf(accountAddress).call(),
      comptrollerContract.methods.venusBorrowState(vTokenAddress).call(),
      comptrollerContract.methods.venusBorrowerIndex(vTokenAddress, accountAddress).call(),
      vTokenContract.methods.borrowBalanceStored(accountAddress).call(),
      vTokenContract.methods.borrowIndex().call(),
      comptrollerContract.methods.venusSupplierIndex(vTokenAddress, accountAddress).call(),
    ]);

    // Calculate XVS reward from supplying tokens
    const adjustedSupplierIndex =
      +supplierIndex === 0 && +supplyState.index > 0 ? venusInitialIndex : supplyState.index;
    const supplierDeltaIndex = new BigNumber(supplyState.index).minus(adjustedSupplierIndex);
    const supplierXvsReward = new BigNumber(supplierTokens)
      .multipliedBy(supplierDeltaIndex)
      // @TODO: check why we have a constant here (1e36 - Venus initial index?)
      .dividedBy(1e36);

    // Calculate XVS reward from borrowing tokens
    let borrowerXvsReward = new BigNumber(0);

    if (+borrowerIndex > 0) {
      const borrowerDeltaIndex = new BigNumber(borrowState.index).minus(borrowerIndex);
      const borrowerAmount = new BigNumber(borrowBalanceStored)
        .multipliedBy(1e18) // @TODO: check why we have a constant here (assumes 18 decimals?)
        .dividedBy(borrowIndex);

      // @TODO: check why we have a constant here (1e36 - Venus initial index?)
      borrowerXvsReward = borrowerAmount.times(borrowerDeltaIndex).dividedBy(1e36);
    }

    return { supplierXvsReward, borrowerXvsReward };
  };

  const tokenRewards = await Promise.all(
    Object.values(VBEP_TOKENS).map(vToken => getXvsRewardSingleToken(vToken.id, vToken.address)),
  );

  // Calculate XVS reward from supplying and borrowing assets
  let xvsEarned = tokenRewards.reduce(
    (acc, { supplierXvsReward, borrowerXvsReward }) =>
      acc.plus(supplierXvsReward).plus(borrowerXvsReward),
    new BigNumber(0),
  );
  xvsEarned = xvsEarned
    .plus(xvsAccrued)
    // @TODO: check why we have a constant here (assumes 18 decimals?)
    .dividedBy(1e18)
    // @TODO: check why we have a constant here (assumes 8 decimals?)
    .dp(8, 1);

  // Calculate XVS reward from minting VAI
  const adjustedVaiMinterIndex =
    vaiMintIndex === 0 && vaiMintIndex > 0 ? venusInitialIndex : userVaiMintIndex;
  const deltaIndex = new BigNumber(vaiMintIndex).minus(new BigNumber(adjustedVaiMinterIndex));

  const vaiMinterDelta = new BigNumber(userMintedVai)
    .times(deltaIndex)
    // @TODO: check why we have a constant here
    .div(1e54)
    // @TODO: check why we have a constant here (assumes 8 decimals?)
    .dp(8, 1);

  // Calculate and return total XVS reward
  const xvsReward = xvsEarned.plus(vaiMinterDelta);
  return xvsReward;
};

export default getXvsReward;
