import { VaultCategory } from 'types';

export const getVaultCategoryName = ({
  category,
  t,
}: {
  category: VaultCategory;
  t: (key: string) => string;
}) => {
  switch (category) {
    case VaultCategory.GOVERNANCE:
      return t('vault.category.governance');
    case VaultCategory.STABLECOINS:
      return t('vault.category.stablecoins');
    case VaultCategory.YIELD_TOKENS:
      return t('vault.category.yieldTokens');
  }
};
