import type { LiteEarnAsset } from '../../types';

const OTHERS_CATEGORY_TAG = 'others';

export const matchesCategories = ({
  earnAsset,
  selectedCategories,
}: {
  earnAsset: LiteEarnAsset;
  selectedCategories: string[];
}) => {
  if (selectedCategories.length === 0) {
    return true;
  }

  const tags = earnAsset.markets.flatMap(market =>
    market.source.type === 'core' && market.source.asset.marketCategory
      ? [market.source.asset.marketCategory.tag]
      : [],
  );

  return (tags.length > 0 ? tags : [OTHERS_CATEGORY_TAG]).some(tag =>
    selectedCategories.includes(tag),
  );
};
