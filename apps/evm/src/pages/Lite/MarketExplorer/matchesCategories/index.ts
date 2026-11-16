import type { LiteBorrowSource, LiteEarnMarketSource } from '../../types';

const OTHERS_CATEGORY_TAG = 'others';

export const matchesCategories = ({
  markets,
  selectedCategories,
}: {
  markets: { source: LiteEarnMarketSource | LiteBorrowSource }[];
  selectedCategories: string[];
}) => {
  if (selectedCategories.length === 0) {
    return true;
  }

  const tags = markets.flatMap(market =>
    market.source.type === 'core' && market.source.asset.marketCategory
      ? [market.source.asset.marketCategory.tag]
      : [],
  );

  return (tags.length > 0 ? tags : [OTHERS_CATEGORY_TAG]).some(tag =>
    selectedCategories.includes(tag),
  );
};
