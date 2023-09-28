import { ethers } from 'ethers';
import { Multicall3 } from 'packages/contractsNew';
import mainPoolComptrollerContractAbi from 'packages/contractsNew/generated/infos/abis/MainPoolComptroller.json';
import rewardsDistributorContractAbi from 'packages/contractsNew/generated/infos/abis/RewardsDistributor.json';
import vaiVaultContractAbi from 'packages/contractsNew/generated/infos/abis/VaiVault.json';
import xvsVaultContractAbi from 'packages/contractsNew/generated/infos/abis/XvsVault.json';

import {
  checkForComptrollerTransactionError,
  checkForTokenTransactionError,
  checkForVaiControllerTransactionError,
  checkForVaiVaultTransactionError,
  checkForXvsVaultProxyTransactionError,
} from 'errors/transactionErrors';

import { ClaimRewardsInput, ClaimRewardsOutput } from './types';

export * from './types';

const claimRewards = async ({
  multicallContract,
  accountAddress,
  claims,
  mainPoolComptrollerContractAddress,
  vaiVaultContractAddress,
  xvsVaultContractAddress,
}: ClaimRewardsInput): Promise<ClaimRewardsOutput> => {
  // Format claims into calls
  const calls: Parameters<Multicall3['tryBlockAndAggregate']>[1] = claims.map(claim => {
    if (claim.contract === 'mainPoolComptroller') {
      const executingInterface = new ethers.utils.Interface(
        JSON.stringify(mainPoolComptrollerContractAbi),
      );
      const callData = executingInterface.encodeFunctionData('claimVenus(address,address[])', [
        accountAddress,
        claim.vTokenAddressesWithPendingReward,
      ]);

      return {
        target: mainPoolComptrollerContractAddress,
        callData,
      };
    }

    if (claim.contract === 'vaiVault') {
      const executingInterface = new ethers.utils.Interface(JSON.stringify(vaiVaultContractAbi));
      const callData = executingInterface.encodeFunctionData('claim(address)', [accountAddress]);

      return {
        target: vaiVaultContractAddress,
        callData,
      };
    }

    if (claim.contract === 'xvsVestingVault') {
      const executingInterface = new ethers.utils.Interface(JSON.stringify(xvsVaultContractAbi));

      const callData = executingInterface.encodeFunctionData('claim(address,address,uint256)', [
        accountAddress,
        claim.rewardToken.address,
        claim.poolIndex,
      ]);

      return {
        target: xvsVaultContractAddress,
        callData,
      };
    }

    // rewardsDistributor
    const executingInterface = new ethers.utils.Interface(
      JSON.stringify(rewardsDistributorContractAbi),
    );

    const callData = executingInterface.encodeFunctionData('claimRewardToken(address,address[])', [
      accountAddress,
      claim.vTokenAddressesWithPendingReward,
    ]);

    return {
      target: claim.contractAddress,
      callData,
    };
  });

  const transaction = await multicallContract.tryBlockAndAggregate(true, calls);
  const receipt = await transaction.wait(1);

  // Check for errors that did not revert the transaction
  checkForComptrollerTransactionError(receipt);
  checkForTokenTransactionError(receipt);
  checkForVaiControllerTransactionError(receipt);
  checkForVaiVaultTransactionError(receipt);
  checkForXvsVaultProxyTransactionError(receipt);

  return receipt;
};

export default claimRewards;
