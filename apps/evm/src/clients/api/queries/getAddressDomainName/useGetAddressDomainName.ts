import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getAddressDomainName, {
  type GetAddressDomainNameInput,
  type GetAddressDomainNameOutput,
} from 'clients/api/queries/getAddressDomainName';
import FunctionKey from 'constants/functionKey';
import { callOrThrow } from 'utilities';

type UseGetAddressDomainNameInput = GetAddressDomainNameInput;

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
  { accountAddress, chainId }: UseGetAddressDomainNameInput,
  options?: Partial<Options>,
) => {
  const queryKey: UseGetAddressDomainNameQueryKey = [
    FunctionKey.GET_ADDRESS_DOMAIN_NAME,
    {
      accountAddress,
      chainId,
    },
  ];

  return useQuery({
    queryKey: queryKey,

    queryFn: () =>
      callOrThrow({ accountAddress }, params => getAddressDomainName({ ...params, chainId })),

    ...options,
  });
};

export default useGetAddressDomainName;
