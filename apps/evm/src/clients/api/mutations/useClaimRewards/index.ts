import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { multicall3Abi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { formatToCalls } from './formatToCalls';
import type { ClaimRewardsInput } from './types';

export * from './types';

type Options = UseSendTransactionOptions<ClaimRewardsInput>;

export const useClaimRewards = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { address: multicall3ContractAddress } = useGetContractAddress({
    name: 'Multicall3',
  });
  const { address: legacyPoolComptrollerContractAddress } = useGetContractAddress({
    name: 'LegacyPoolComptroller',
  });

  const { address: vaiVaultContractAddress } = useGetContractAddress({
    name: 'VaiVault',
  });
  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });

  const { address: primeContractAddress } = useGetContractAddress({
    name: 'Prime',
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: (input: ClaimRewardsInput) => {
      if (!multicall3ContractAddress || !xvsVaultContractAddress || !accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const calls = formatToCalls({
        claims: input.claims,
        accountAddress,
        legacyPoolComptrollerContractAddress,
        vaiVaultContractAddress,
        xvsVaultContractAddress,
        primeContractAddress,
      });

      return {
        address: multicall3ContractAddress,
        abi: multicall3Abi,
        functionName: 'tryBlockAndAggregate',
        args: [true, calls],
      };
    },
    onConfirmed: ({ input }) => {
      input.claims.forEach(claim => {
        if (claim.contract === 'legacyPoolComptroller') {
          captureAnalyticEvent('Pool reward claimed', {
            comptrollerAddress: legacyPoolComptrollerContractAddress || '',
          });
        } else if (claim.contract === 'rewardsDistributor') {
          captureAnalyticEvent('Pool reward claimed', {
            comptrollerAddress: claim.comptrollerContractAddress,
          });
        } else if (claim.contract === 'vaiVault') {
          captureAnalyticEvent('VAI vault reward claimed', undefined);
        } else if (claim.contract === 'xvsVestingVault') {
          captureAnalyticEvent('XVS vesting vault reward claimed', {
            poolIndex: claim.poolIndex,
            rewardTokenSymbol: claim.rewardToken.symbol,
          });
        } else if (claim.contract === 'prime') {
          captureAnalyticEvent('Prime reward claimed', undefined);
        }
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_PENDING_REWARDS, { accountAddress, chainId }],
      });
    },
    options,
  });
};
