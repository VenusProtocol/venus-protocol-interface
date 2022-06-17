import { useQuery, QueryObserverOptions } from 'react-query';
import getVrtVaultInterestRatePerBlock, {
  GetVrtVaultInterestRatePerBlockOutput,
} from 'clients/api/queries/getVrtVaultInterestRatePerBlock';
import FunctionKey from 'constants/functionKey';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVrtVaultInterestRatePerBlockOutput,
  Error,
  GetVrtVaultInterestRatePerBlockOutput,
  GetVrtVaultInterestRatePerBlockOutput,
  FunctionKey.GET_VRT_VAULT_INTEREST_RATE_WEI_PER_BLOCK
>;

const useGetVrtVaultInterestRatePerBlock = (options?: Options) => {
  const vrtVaultContract = useVrtVaultProxyContract();

  return useQuery(
    FunctionKey.GET_VRT_VAULT_INTEREST_RATE_WEI_PER_BLOCK,
    () => getVrtVaultInterestRatePerBlock({ vrtVaultContract }),
    options,
  );
};

export default useGetVrtVaultInterestRatePerBlock;
