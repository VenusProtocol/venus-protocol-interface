import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';

export const invalidateInstitutionalVaultQueries = () => {
  queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_BALANCE_OF] });
  queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_FIXED_RATED_VAULTS] });
  queryClient.invalidateQueries({
    queryKey: [FunctionKey.GET_TOKEN_BALANCES],
  });
  queryClient.invalidateQueries({
    queryKey: [FunctionKey.GET_INSTITUTIONAL_VAULT_USER_DATA],
  });
};
