import { MutationObserverOptions } from 'react-query';
import { Asset, VTokenId } from 'types';
import {
  useSupplyNonBnb,
  useSupplyBnb,
  ISupplyNonBnbInput,
  ISupplyBnbInput,
  SupplyBnbOutput,
  SupplyBnbParams,
  SupplyNonBnbOutput,
  SupplyNonBnbParams,
} from 'clients/api';

interface IUseSupplyArgs {
  asset: Asset;
  account: string;
}

type OptionsSupplyBnb = MutationObserverOptions<SupplyBnbOutput, Error, SupplyBnbParams>;
type OptionsSupplyNonBnb = MutationObserverOptions<SupplyNonBnbOutput, Error, SupplyNonBnbParams>;

export type UseSupplyParams =
  | Omit<ISupplyNonBnbInput, 'tokenContract' | 'assetId' | 'account'>
  | Omit<ISupplyBnbInput, 'tokenContract' | 'assetId' | 'account'>;

const useSupply = (
  { asset, account }: IUseSupplyArgs,
  options?: OptionsSupplyBnb | OptionsSupplyNonBnb,
) => {
  const useSupplyNonBnbResult = useSupplyNonBnb(
    {
      assetId: asset?.id as VTokenId,
      account,
    },
    options as OptionsSupplyNonBnb,
  );
  const useSupplyBnbResult = useSupplyBnb({ account }, options as OptionsSupplyBnb);
  return asset.id === 'bnb' ? useSupplyBnbResult : useSupplyNonBnbResult;
};

export default useSupply;
