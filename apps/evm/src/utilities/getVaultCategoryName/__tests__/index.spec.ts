import { VaultCategory } from 'types';

import { getVaultCategoryName } from '../index';

describe('utilities/getVaultCategoryName', () => {
  it.each([
    {
      category: VaultCategory.GOVERNANCE,
      translationKey: 'vault.category.governance',
    },
    {
      category: VaultCategory.STABLECOINS,
      translationKey: 'vault.category.stablecoins',
    },
    {
      category: VaultCategory.YIELD_TOKENS,
      translationKey: 'vault.category.yieldTokens',
    },
  ])('returns the translated name for $category vaults', ({ category, translationKey }) => {
    const t = vi.fn().mockReturnValue('translated category');

    const result = getVaultCategoryName({
      category,
      t,
    });

    expect(result).toBe('translated category');
    expect(t).toHaveBeenCalledTimes(1);
    expect(t).toHaveBeenCalledWith(translationKey);
  });
});
