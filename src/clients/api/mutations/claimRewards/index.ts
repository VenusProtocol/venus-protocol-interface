import { abi as rewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';
import { ethers } from 'ethers';

// TODO: import ABIs from npm package (see VEN-836)
import comptrollerAbi from 'constants/contracts/abis/comptroller.json';
import vaiVaultAbi from 'constants/contracts/abis/vaiVault.json';
import xvsVaultAbi from 'constants/contracts/abis/xvsVault.json';
import {
  checkForComptrollerTransactionError,
  checkForTokenTransactionError,
  checkForVaiControllerTransactionError,
  checkForVaiVaultTransactionError,
  checkForXvsVaultProxyTransactionError,
} from 'errors/transactionErrors';
import { Multicall3 } from 'types/contracts/Multicall';

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
  const calls: Multicall3.CallStruct[] = claims.map(claim => {
    if (claim.contract === 'mainPoolComptroller') {
      const executingInterface = new ethers.utils.Interface(JSON.stringify(comptrollerAbi));
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
      const executingInterface = new ethers.utils.Interface(JSON.stringify(vaiVaultAbi));

      const callData = executingInterface.encodeFunctionData('claim(address)', [accountAddress]);

      return {
        target: vaiVaultContractAddress,
        callData,
      };
    }

    if (claim.contract === 'xvsVestingVault') {
      const executingInterface = new ethers.utils.Interface(JSON.stringify(xvsVaultAbi));

      const callData = executingInterface.encodeFunctionData('claim(address,address,uint256)', [
        accountAddress,
        claim.rewardTokenAddress,
        claim.poolIndex,
      ]);

      return {
        target: xvsVaultContractAddress,
        callData,
      };
    }

    // rewardsDistributor
    const executingInterface = new ethers.utils.Interface(JSON.stringify(rewardsDistributorAbi));

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
