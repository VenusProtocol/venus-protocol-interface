import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import type { Mock } from 'vitest';

import { invalidateInstitutionalVaultQueries } from '..';

describe('clients/api/mutations/invalidateInstitutionalVaultQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invalidates all institutional vault queries including token balances', () => {
    invalidateInstitutionalVaultQueries();

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(4);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toEqual([
      [{ queryKey: [FunctionKey.GET_BALANCE_OF] }],
      [{ queryKey: [FunctionKey.GET_FIXED_RATED_VAULTS] }],
      [{ queryKey: [FunctionKey.GET_TOKEN_BALANCES] }],
      [{ queryKey: [FunctionKey.GET_INSTITUTIONAL_VAULT_USER_DATA] }],
    ]);
  });
});
