import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

import { UniqueContractAddressGetter } from '../uniqueContractAddressGetterGenerator';

export interface UniqueContractAddressGetterHookGeneratorInput {
  getter: UniqueContractAddressGetter;
}

export const uniqueContractAddressGetterHookGenerator =
  ({ getter }: UniqueContractAddressGetterHookGeneratorInput) =>
  () => {
    const { chainId } = useAuth();

    return useMemo(
      () =>
        getter({
          chainId,
        }),
      [chainId],
    );
  };
