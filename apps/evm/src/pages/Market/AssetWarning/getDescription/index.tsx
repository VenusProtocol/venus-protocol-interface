import type { useTranslation } from 'libs/translations';
import type { Asset, Pool } from 'types';
import { areTokensEqual } from 'utilities';

export interface GetDescriptionInput {
  asset: Asset;
  pool: Pool;
  tokenSymbol: string;
  Trans: ReturnType<typeof useTranslation>['Trans'];
  showAllMarketsButton: React.ReactElement;
  modeInfoButton: React.ReactElement;
}

// Translation keys: do not remove this comment
// t('assetWarning.modeOnly.eModeAndIsolation')
// t('assetWarning.modeOnly.eMode')
// t('assetWarning.modeOnly.isolation')
export const getDescription = ({
  asset,
  pool,
  tokenSymbol,
  Trans,
  showAllMarketsButton,
  modeInfoButton,
}: GetDescriptionInput) => {
  const isAvailableInCore = !(asset.collateralFactor === 0 && !asset.isBorrowable);

  let isAvailableInEMode = false;
  let isAvailableInIsolation = false;

  for (const group of pool.eModeGroups) {
    const isInGroup = group.assetSettings.some(settings =>
      areTokensEqual(settings.vToken, asset.vToken),
    );

    if (!isInGroup) {
      continue;
    }

    if (group.isIsolated) {
      isAvailableInIsolation = true;
      continue;
    }

    isAvailableInEMode = true;
  }

  if (!isAvailableInEMode && !isAvailableInCore && !isAvailableInIsolation) {
    return undefined;
  }

  if (isAvailableInCore) {
    const hasMode = isAvailableInEMode || isAvailableInIsolation;

    return (
      <>
        <Trans
          i18nKey="assetWarning.supplyDescription"
          values={{ tokenSymbol }}
          components={{ ShowAllMarketsButton: showAllMarketsButton }}
        />

        {hasMode && (
          <Trans
            i18nKey="assetWarning.modeInfoHint"
            components={{ LineBreak: <br />, ModeInfoButton: modeInfoButton }}
          />
        )}
      </>
    );
  }

  let i18nKey = 'assetWarning.modeOnly.isolation';

  if (isAvailableInEMode && isAvailableInIsolation) {
    i18nKey = 'assetWarning.modeOnly.eModeAndIsolation';
  } else if (isAvailableInEMode) {
    i18nKey = 'assetWarning.modeOnly.eMode';
  }

  return (
    <Trans
      i18nKey={i18nKey}
      values={{ tokenSymbol }}
      components={{
        ShowAllMarketsButton: showAllMarketsButton,
        ModeInfoButton: modeInfoButton,
      }}
    />
  );
};
