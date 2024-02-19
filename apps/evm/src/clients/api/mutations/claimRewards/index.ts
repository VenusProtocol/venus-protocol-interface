import {
  legacyPoolComptrollerContractAbi,
  primeContractAbi,
  rewardsDistributorContractAbi,
  vaiVaultContractAbi,
  xvsVaultContractAbi,
} from '@venusprotocol/web3';
import { ethers } from 'ethers';

import { Multicall3 } from 'libs/contracts';

import { ClaimRewardsInput, ClaimRewardsOutput } from './types';

export * from './types';

const claimRewards = async ({
  multicallContract,
  accountAddress,
  claims,
  legacyPoolComptrollerContractAddress,
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

    if (claim.contract === 'legacyPoolComptroller' && !!legacyPoolComptrollerContractAddress) {
      const executingInterface = new ethers.utils.Interface(
        JSON.stringify(legacyPoolComptrollerContractAbi),
      );

      return [
        ...acc,
        {
          callData: executingInterface.encodeFunctionData('claimVenus(address,address[])', [
            accountAddress,
            claim.vTokenAddressesWithPendingReward,
          ]),
          target: legacyPoolComptrollerContractAddress,
        },
      ];
    }

    if (claim.contract === 'vaiVault' && !!vaiVaultContractAddress) {
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

  return multicallContract.tryBlockAndAggregate(true, calls);
};

export default claimRewards;
