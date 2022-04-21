import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { getToken } from 'utilities';
import { VBEP_TOKENS, VBEP_TOKEN_DECIMALS } from 'constants/tokens';
import { Comptroller } from 'types/contracts';
import getVTokenData from './getVTokenData';

export interface IGetXvsRewardInput {
  web3: Web3;
  accountAddress: string;
  comptrollerContract: Comptroller;
  venusInitialIndex: string;
  xvsAccrued: BigNumber;
  vaiMintIndex: string;
  userVaiMintIndex: string;
  userMintedVai: BigNumber;
}

export type GetXvsRewardOutput = BigNumber;

// @TODO: refactor once method to fetch XVS reward from a contract has been
// implemented (see https://app.clickup.com/t/284g9ed)

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
  const vTokensData = await Promise.all(
    Object.values(VBEP_TOKENS).map(vToken =>
      getVTokenData({
        web3,
        comptrollerContract,
        tokenId: vToken.id,
        tokenAddress: vToken.address,
        accountAddress,
      }),
    ),
  );

  const xvsEarned = vTokensData.reduce(
    (
      acc,
      {
        userSupplyIndex,
        userBorrowIndex,
        tokenBorrowIndex,
        userBorrowBalanceStoredWei,
        supplyStateIndex,
        borrowStateIndex,
        userBalanceWei,
      },
    ) => {
      // Calculate XVS reward from supplying tokens
      const adjustedSupplierIndex =
        +userSupplyIndex === 0 && +supplyStateIndex > 0 ? venusInitialIndex : userSupplyIndex;

      const supplierDeltaIndex = new BigNumber(supplyStateIndex).minus(adjustedSupplierIndex);
      const supplierXvsReward = new BigNumber(userBalanceWei)
        .multipliedBy(supplierDeltaIndex)
        .dividedBy(1e36);

      // Calculate XVS reward from borrowing tokens
      let borrowerXvsReward = new BigNumber(0);

      if (+userBorrowIndex > 0) {
        const borrowerDeltaIndex = new BigNumber(borrowStateIndex).minus(userBorrowIndex);
        const borrowerAmount = new BigNumber(userBorrowBalanceStoredWei)
          .multipliedBy(1e18)
          .dividedBy(tokenBorrowIndex);

        borrowerXvsReward = borrowerAmount.times(borrowerDeltaIndex).dividedBy(1e36);
      }

      // Add XVS rewards to accumulator
      return acc.plus(supplierXvsReward).plus(borrowerXvsReward);
    },
    new BigNumber(0),
  );

  const totalXvsEarned = xvsEarned.plus(xvsAccrued).dividedBy(1e18).dp(VBEP_TOKEN_DECIMALS, 1);

  // Calculate XVS reward from minting VAI
  const adjustedVaiMinterIndex =
    userVaiMintIndex === '0' && +vaiMintIndex < 0 ? venusInitialIndex : userVaiMintIndex;

  const deltaIndex = new BigNumber(vaiMintIndex).minus(new BigNumber(adjustedVaiMinterIndex));
  const vaiMinterDelta = new BigNumber(userMintedVai)
    .times(deltaIndex)
    .div(1e54)
    .dp(VBEP_TOKEN_DECIMALS, 1);

  // Calculate and return total XVS reward
  const xvsRewardTokens = totalXvsEarned.plus(vaiMinterDelta);
  const xvsDecimals = getToken('xvs').decimals;
  const xvsRewardWei = xvsRewardTokens.multipliedBy(new BigNumber(10).pow(xvsDecimals));

  return xvsRewardWei;
};

export default getXvsReward;
