import { Asset, VTokenId } from 'types';
import { useSupplyNonBnb, useSupplyBnb, ISupplyInput, ISupplyBnbInput } from 'clients/api';

interface IUseSupplyArgs {
  asset: Asset;
  account: string | undefined;
}

export type UseSupplyParams =
  | Omit<ISupplyInput, 'tokenContract' | 'assetId' | 'account'>
  | Omit<ISupplyBnbInput, 'tokenContract' | 'assetId' | 'account'>;

const useSupply = ({ asset, account }: IUseSupplyArgs) => {
  const { mutate: supplyNonBnb, isLoading: isSupplyNonBnBLoading } = useSupplyNonBnb({
    assetId: asset?.id as VTokenId,
    account,
  });
  const { mutate: supplyBnb, isLoading: isSupplyBnbLoading } = useSupplyBnb({ account });
  if (asset.id === 'bnb') {
    return { supply: supplyBnb, isLoading: isSupplyBnbLoading };
  }
  return { supply: supplyNonBnb, isLoading: isSupplyNonBnBLoading };
};

export default useSupply;
