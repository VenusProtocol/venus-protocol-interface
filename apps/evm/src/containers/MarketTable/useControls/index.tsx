import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { useUserChainSettings } from 'hooks/useUserChainSettings';
import type { Asset, MarketCategory } from 'types';
import { isAssetPaused } from 'utilities';

import { CATEGORY_PARAM_KEY, CATEGORY_PARAM_VALUE_SEPARATOR } from '../constants';

const OTHERS_CATEGORY_TAG = 'others';

export const useControls = ({
  assets,
  applyUserSettings,
  categoryFilter,
}: {
  assets: Asset[];
  applyUserSettings: boolean;
  categoryFilter: boolean;
}) => {
  const [searchValue, onSearchValueChange] = useState('');
  const [userChainSettings] = useUserChainSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const { showPausedAssets, showUserAssetsOnly } = userChainSettings;

  const categoriesByTag = new Map<string, MarketCategory>();

  assets.forEach(asset => {
    if (asset.marketCategory && !categoriesByTag.has(asset.marketCategory.tag)) {
      categoriesByTag.set(asset.marketCategory.tag, asset.marketCategory);
    }
  });

  // Sorted the way the filter displays its options, so the selection read from the url
  // and the one written back to it are both ordered the way the user sees them. A lone
  // category offers no choice and its control is not rendered, so it is not selectable
  // either: a filter applied from the url with nothing on screen to undo it would leave
  // the user with a truncated table and no way back
  const sortedCategories = [...categoriesByTag.values()].sort((a, b) => a.order - b.order);
  const categories = sortedCategories.length > 1 ? sortedCategories : [];
  const selectableCategoryTags = categories.map(category => category.tag);

  // Keeping the selection in the url is what makes a shortcut link possible: opening
  // /markets/<pool>?category=<tag> lands on the page with that filter already applied.
  // Tags are matched against the categories this pool actually offers, case-insensitively,
  // so an unknown or differently spelled tag is ignored rather than emptying the table
  const paramCategoryTags = (searchParams.get(CATEGORY_PARAM_KEY) ?? '')
    .split(CATEGORY_PARAM_VALUE_SEPARATOR)
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0);

  const selectedCategories = categoryFilter
    ? selectableCategoryTags.filter(tag => paramCategoryTags.includes(tag.toLowerCase()))
    : [];

  const rawCategoryParam = searchParams.get(CATEGORY_PARAM_KEY);
  const canonicalCategoryParam = selectedCategories.join(CATEGORY_PARAM_VALUE_SEPARATOR);

  // A tag this pool does not offer applies no filter, so it has no business staying in
  // the url either: drop it, and rewrite a tag that resolved to a selection spelled or
  // ordered differently to the spelling the filter itself writes, so the url and the
  // control never disagree. There is no loading window to guard against here: the page
  // only mounts this table once the pool has resolved, and categories arrive on the
  // assets themselves rather than separately
  useEffect(() => {
    if (
      !categoryFilter ||
      rawCategoryParam === null ||
      rawCategoryParam === canonicalCategoryParam
    ) {
      return;
    }

    setSearchParams(
      currentSearchParams => {
        const newSearchParams = new URLSearchParams(currentSearchParams);

        if (canonicalCategoryParam) {
          newSearchParams.set(CATEGORY_PARAM_KEY, canonicalCategoryParam);
        } else {
          newSearchParams.delete(CATEGORY_PARAM_KEY);
        }

        return newSearchParams;
      },
      { replace: true },
    );
  }, [categoryFilter, rawCategoryParam, canonicalCategoryParam, setSearchParams]);

  // Filter changes replace the current history entry rather than pushing a new one, so
  // going back leaves the page instead of stepping through every option that was toggled
  const onSelectedCategoriesChange = (newTags: string[]) =>
    setSearchParams(
      currentSearchParams => {
        const newSearchParams = new URLSearchParams(currentSearchParams);
        const orderedTags = selectableCategoryTags.filter(tag => newTags.includes(tag));

        if (orderedTags.length === 0) {
          newSearchParams.delete(CATEGORY_PARAM_KEY);
        } else {
          newSearchParams.set(CATEGORY_PARAM_KEY, orderedTags.join(CATEGORY_PARAM_VALUE_SEPARATOR));
        }

        return newSearchParams;
      },
      { replace: true },
    );

  const filteredAssets: Asset[] = [];
  let hiddenPausedAssetsExist = false;

  assets.forEach(asset => {
    const isUserAsset = asset.userWalletBalanceTokens.isGreaterThan(0);

    if (applyUserSettings && !isUserAsset && showUserAssetsOnly) {
      return;
    }

    // Handle search
    if (
      !!searchValue &&
      !asset.vToken.underlyingToken.symbol.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return;
    }

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(
        asset.category && categoriesByTag.has(asset.category)
          ? asset.category
          : OTHERS_CATEGORY_TAG,
      )
    ) {
      return;
    }

    if (
      applyUserSettings &&
      !showPausedAssets &&
      isAssetPaused({ disabledTokenActions: asset.disabledTokenActions })
    ) {
      hiddenPausedAssetsExist = true;
      return;
    }

    filteredAssets.push(asset);
  });

  return {
    assets: filteredAssets,
    categories,
    searchValue,
    onSearchValueChange,
    selectedCategories,
    onSelectedCategoriesChange,
    hiddenPausedAssetsExist,
    showPausedAssets,
    showUserAssetsOnly,
  };
};
