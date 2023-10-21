import { ethers } from 'ethers';
import { Multicall3 } from 'packages/contracts';
import mainPoolComptrollerContractAbi from 'packages/contracts/generated/infos/abis/MainPoolComptroller.json';
import primeContractAbi from 'packages/contracts/generated/infos/abis/Prime.json';
import rewardsDistributorContractAbi from 'packages/contracts/generated/infos/abis/RewardsDistributor.json';
import vaiVaultContractAbi from 'packages/contracts/generated/infos/abis/VaiVault.json';
import xvsVaultContractAbi from 'packages/contracts/generated/infos/abis/XvsVault.json';

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
  primeContractAddress,
}: ClaimRewardsInput): Promise<ClaimRewardsOutput> => {
  // Format claims into calls
  const calls = claims.reduce<Parameters<Multicall3['tryBlockAndAggregate']>[1]>((acc, claim) => {
    // Skip claim if no Prime contract address was passed
    if (claim.contract === 'prime' && !primeContractAddress) {
      return acc;
    }

    if (claim.contract === 'mainPoolComptroller') {
      const executingInterface = new ethers.utils.Interface(
        JSON.stringify(mainPoolComptrollerContractAbi),
      );

      return [
        ...acc,
        {
          callData: executingInterface.encodeFunctionData('claimVenus(address,address[])', [
            accountAddress,
            claim.vTokenAddressesWithPendingReward,
          ]),
          target: mainPoolComptrollerContractAddress,
        },
      ];
    }

    if (claim.contract === 'vaiVault') {
      const executingInterface = new ethers.utils.Interface(JSON.stringify(vaiVaultContractAbi));

      return [
        ...acc,
        {
          callData: executingInterface.encodeFunctionData('claim(address)', [accountAddress]),
          target: vaiVaultContractAddress,
        },
      ];
    }

    if (claim.contract === 'xvsVestingVault') {
      const executingInterface = new ethers.utils.Interface(JSON.stringify(xvsVaultContractAbi));

      return [
        ...acc,
        {
          callData: executingInterface.encodeFunctionData('claim(address,address,uint256)', [
            accountAddress,
            claim.rewardToken.address,
            claim.poolIndex,
          ]),
          target: xvsVaultContractAddress,
        },
      ];
    }

    if (claim.contract === 'rewardsDistributor') {
      const executingInterface = new ethers.utils.Interface(
        JSON.stringify(rewardsDistributorContractAbi),
      );

      return [
        ...acc,
        {
          callData: executingInterface.encodeFunctionData('claimRewardToken(address,address[])', [
            accountAddress,
            claim.vTokenAddressesWithPendingReward,
          ]),
          target: claim.contractAddress,
        },
      ];
    }

    if (claim.contract === 'prime' && !!primeContractAddress) {
      const executingInterface = new ethers.utils.Interface(JSON.stringify(primeContractAbi));
      const primeCalls = claim.vTokenAddressesWithPendingReward.map(vTokenAddress => ({
        callData: executingInterface.encodeFunctionData('claimInterest(address,address)', [
          vTokenAddress,
          accountAddress,
        ]),
        target: primeContractAddress,
      }));

      return acc.concat(primeCalls);
    }

    return acc;
  }, []);

  const transaction = await multicallContract.tryBlockAndAggregate(true, calls);
  const receipt = await transaction.wait(1);

  // Check for errors that did not revert the transaction
  // TODO: remove once this function has been refactored to use useSendTransaction hook
  checkForComptrollerTransactionError(receipt);
  checkForTokenTransactionError(receipt);
  checkForVaiControllerTransactionError(receipt);
  checkForVaiVaultTransactionError(receipt);
  checkForXvsVaultProxyTransactionError(receipt);

  return receipt;
};

export default claimRewards;
