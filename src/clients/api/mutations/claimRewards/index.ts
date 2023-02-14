import { abi as rewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';
import { ethers } from 'ethers';
import { getContractAddress } from 'utilities';

// TODO: import ABIs from npm package (see VEN-836)
import comptrollerAbi from 'constants/contracts/abis/comptroller.json';
import vaiVaultAbi from 'constants/contracts/abis/vaiVault.json';
import vrtVaultAbi from 'constants/contracts/abis/vrtVault.json';
import { Multicall3 } from 'types/contracts/Multicall';

import { ClaimRewardsInput, ClaimRewardsOutput } from './types';

export * from './types';

// TODO: get addresses npm package (see VEN-836)
const comptrollerAddress = getContractAddress('comptroller');
const vaiVaultAddress = getContractAddress('vaiVault');
const vrtVaultAddress = getContractAddress('vrtVaultProxy');

// TODO: add tests

const claimRewards = async ({
  multicallContract,
  accountAddress,
  claims,
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
        target: comptrollerAddress,
        callData,
      };
    }

    if (claim.contract === 'vaiVault') {
      const executingInterface = new ethers.utils.Interface(JSON.stringify(vaiVaultAbi));

      const callData = executingInterface.encodeFunctionData(
        'claim',
        // TODO: add account address once function has been updated on contract
      );

      return {
        target: vaiVaultAddress,
        callData,
      };
    }

    if (claim.contract === 'vrtVault') {
      const executingInterface = new ethers.utils.Interface(JSON.stringify(vrtVaultAbi));

      const callData = executingInterface.encodeFunctionData(
        'claim',
        // TODO: add account address once function has been updated on contract
      );

      return {
        target: vrtVaultAddress,
        callData,
      };
    }

    if (claim.contract === 'xvsVestingVault') {
      const executingInterface = new ethers.utils.Interface(JSON.stringify(rewardsDistributorAbi));

      const callData = executingInterface.encodeFunctionData('deposit', [
        claim.rewardTokenAddress,
        claim.poolIndex,
        0,
        // TODO: add account address once function has been updated on contract
      ]);

      return {
        target: vrtVaultAddress,
        callData,
      };
    }

    // rewardsDistributor
    const executingInterface = new ethers.utils.Interface(JSON.stringify(rewardsDistributorAbi));

    const callData = executingInterface.encodeFunctionData('claimRewardToken', [
      accountAddress,
      claim.vTokenAddressesWithPendingReward,
      0,
    ]);

    return {
      target: claim.contractAddress,
      callData,
    };
  });

  const transaction = await multicallContract.tryBlockAndAggregate(true, calls);
  const receipt = await transaction.wait(1);

  // TODO: check for errors within contracts (checkForXvsVaultProxyTransactionError etc.)
  return receipt;
};

export default claimRewards;
