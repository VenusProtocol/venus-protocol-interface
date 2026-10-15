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

  const sortedCategories = [...categoriesByTag.values()].sort((a, b) => a.order - b.order);
  const categories = sortedCategories.length > 1 ? sortedCategories : [];
  const selectableCategoryTags = categories.map(category => category.tag);

  const paramCategoryTags = (searchParams.get(CATEGORY_PARAM_KEY) ?? '')
    .split(CATEGORY_PARAM_VALUE_SEPARATOR)
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0);

  const selectedCategories = categoryFilter
    ? selectableCategoryTags.filter(tag => paramCategoryTags.includes(tag.toLowerCase()))
    : [];

  const rawCategoryParam = searchParams.get(CATEGORY_PARAM_KEY);
  const canonicalCategoryParam = selectedCategories.join(CATEGORY_PARAM_VALUE_SEPARATOR);

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
