import {
  legacyPoolComptrollerAbi,
  primeAbi,
  rewardsDistributorAbi,
  vaiVaultAbi,
  xvsVaultAbi,
} from 'libs/contracts';
import { type Address, type Hex, encodeFunctionData } from 'viem';
import type { Claim } from '../types';

export const formatToCalls = ({
  claims,
  accountAddress,
  legacyPoolComptrollerContractAddress,
  vaiVaultContractAddress,
  xvsVaultContractAddress,
  primeContractAddress,
}: {
  claims: Claim[];
  accountAddress: Address;
  xvsVaultContractAddress: Address;
  legacyPoolComptrollerContractAddress?: Address;
  vaiVaultContractAddress?: Address;
  primeContractAddress?: Address;
}) =>
  claims.reduce<
    {
      callData: Hex;
      target: Address;
    }[]
  >((acc, claim) => {
    if (claim.contract === 'legacyPoolComptroller' && !!legacyPoolComptrollerContractAddress) {
      return [
        ...acc,
        {
          callData: encodeFunctionData({
            abi: legacyPoolComptrollerAbi,
            functionName: 'claimVenus',
            args: [accountAddress, claim.vTokenAddressesWithPendingReward],
          }),
          target: legacyPoolComptrollerContractAddress,
        },
      ];
    }

    if (claim.contract === 'vaiVault' && !!vaiVaultContractAddress) {
      return [
        ...acc,
        {
          callData: encodeFunctionData({
            abi: vaiVaultAbi,
            functionName: 'claim',
            args: [accountAddress],
          }),
          target: vaiVaultContractAddress,
        },
      ];
    }

    if (claim.contract === 'xvsVestingVault') {
      return [
        ...acc,
        {
          callData: encodeFunctionData({
            abi: xvsVaultAbi,
            functionName: 'claim',
            args: [accountAddress, claim.rewardToken.address, BigInt(claim.poolIndex)],
          }),
          target: xvsVaultContractAddress,
        },
      ];
    }

    if (claim.contract === 'rewardsDistributor') {
      return [
        ...acc,
        {
          callData: encodeFunctionData({
            abi: rewardsDistributorAbi,
            functionName: 'claimRewardToken',
            args: [accountAddress, claim.vTokenAddressesWithPendingReward],
          }),
          target: claim.contractAddress,
        },
      ];
    }

    if (claim.contract === 'prime' && !!primeContractAddress) {
      const primeCalls = claim.vTokenAddressesWithPendingReward.map(vTokenAddress => ({
        callData: encodeFunctionData({
          abi: primeAbi,
          functionName: 'claimInterest',
          args: [vTokenAddress, accountAddress],
        }),
        target: primeContractAddress,
      }));

      return [...acc, ...primeCalls];
    }

    return acc;
  }, []);
