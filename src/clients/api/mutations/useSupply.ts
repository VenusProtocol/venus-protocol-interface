import { MutationObserverOptions } from 'react-query';
import { Asset, VTokenId } from 'types';

import {
  SupplyBnbInput,
  SupplyBnbOutput,
  SupplyBnbParams,
  SupplyNonBnbInput,
  SupplyNonBnbOutput,
  SupplyNonBnbParams,
  useSupplyBnb,
  useSupplyNonBnb,
} from 'clients/api';

interface UseSupplyArgs {
  assetId: Asset['id'];
  account: string;
}

type OptionsSupplyBnb = MutationObserverOptions<SupplyBnbOutput, Error, SupplyBnbParams>;
type OptionsSupplyNonBnb = MutationObserverOptions<SupplyNonBnbOutput, Error, SupplyNonBnbParams>;

export type UseSupplyParams =
  | Omit<SupplyNonBnbInput, 'tokenContract' | 'assetId' | 'account'>
  | Omit<SupplyBnbInput, 'tokenContract' | 'assetId' | 'account'>;

const useSupply = (
  { assetId, account }: UseSupplyArgs,
  options?: OptionsSupplyBnb | OptionsSupplyNonBnb,
) => {
  const useSupplyNonBnbResult = useSupplyNonBnb(
    {
      assetId: assetId as VTokenId,
      account,
    },
    options as OptionsSupplyNonBnb,
  );

  const useSupplyBnbResult = useSupplyBnb({ account }, options as OptionsSupplyBnb);

  return assetId === 'bnb' ? useSupplyBnbResult : useSupplyNonBnbResult;
};

export default useSupply;
