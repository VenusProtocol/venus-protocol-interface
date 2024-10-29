import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getAddressDomainName, {
  type GetAddressDomainNameInput,
  type GetAddressDomainNameOutput,
} from 'clients/api/queries/getAddressDomainName';
import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type UseGetAddressDomainNameInput = Omit<GetAddressDomainNameInput, 'chainId'> & {
  chainId?: ChainId;
};

export type UseGetAddressDomainNameQueryKey = [
  FunctionKey.GET_ADDRESS_DOMAIN_NAME,
  GetAddressDomainNameInput,
];

type Options = QueryObserverOptions<
  GetAddressDomainNameOutput,
  Error,
  GetAddressDomainNameOutput,
  GetAddressDomainNameOutput,
  UseGetAddressDomainNameQueryKey
>;

const useGetAddressDomainName = (
  { accountAddress, chainId: passedChainId }: UseGetAddressDomainNameInput,
  options?: Partial<Options>,
) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = passedChainId ?? currentChainId;

  const queryKey: UseGetAddressDomainNameQueryKey = [
    FunctionKey.GET_ADDRESS_DOMAIN_NAME,
    {
      chainId,
      accountAddress,
    },
  ];

  return useQuery({
    queryKey: queryKey,

    queryFn: () =>
      callOrThrow({ accountAddress, chainId }, params => getAddressDomainName({ ...params })),

    ...options,
  });
};

export default useGetAddressDomainName;
