import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import type { Address } from 'viem';
import { type GetLiquidityHubOperatorAddressOutput, getLiquidityHubOperatorAddress } from '..';

export type UseGetLiquidityHubOperatorAddressInput = {
  vhTokenAddress: Address;
};

export type UseGetLiquidityHubOperatorAddressQueryKey = [
  FunctionKey.GET_LIQUIDITY_HUB_OPERATOR_ADDRESS,
  { chainId: ChainId; vhTokenAddress: Address },
];

type Options = QueryObserverOptions<
  GetLiquidityHubOperatorAddressOutput,
  Error,
  GetLiquidityHubOperatorAddressOutput,
  GetLiquidityHubOperatorAddressOutput,
  UseGetLiquidityHubOperatorAddressQueryKey
>;

export const useGetLiquidityHubOperatorAddress = (
  { vhTokenAddress }: UseGetLiquidityHubOperatorAddressInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [FunctionKey.GET_LIQUIDITY_HUB_OPERATOR_ADDRESS, { chainId, vhTokenAddress }],
    queryFn: () => getLiquidityHubOperatorAddress({ publicClient, vhTokenAddress }),
    ...options,
  });
};
