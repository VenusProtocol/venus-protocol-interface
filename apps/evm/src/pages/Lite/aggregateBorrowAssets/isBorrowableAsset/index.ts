import type { Asset } from 'types';
import { isAssetPaused } from 'utilities/isAssetPaused';

export const isBorrowableAsset = (asset: Asset) =>
  asset.isBorrowable &&
  !asset.disabledTokenActions.includes('borrow') &&
  !isAssetPaused({ disabledTokenActions: asset.disabledTokenActions });
