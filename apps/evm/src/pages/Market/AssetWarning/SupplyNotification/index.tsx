import { TextButton } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';
import type { Asset, Pool } from 'types';
import { areTokensEqual, scrollToElement } from 'utilities';

export interface SupplyNotificationProps {
  asset: Asset;
  pool: Pool;
  onShowAllMarkets: () => void;
}

// Translation keys: do not remove this comment
// t('assetWarning.modeOnly.eModeAndIsolation')
// t('assetWarning.modeOnly.eMode')
// t('assetWarning.modeOnly.isolation')

export const SupplyNotification: React.FC<SupplyNotificationProps> = ({
  asset,
  pool,
  onShowAllMarkets,
}) => {
  const { Trans } = useTranslation();

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
    } else {
      isAvailableInEMode = true;
    }
  }

  const tokenSymbol = asset.vToken.underlyingToken.symbol;
  const handleScrollToModeInfo = () => scrollToElement('mode-info');

  const showAllMarketsButton = (
    <TextButton className="p-0 h-auto font-medium text-xs md:text-sm" onClick={onShowAllMarkets} />
  );

  const modeInfoButton = (
    <TextButton
      className="p-0 h-auto font-medium text-xs md:text-sm"
      onClick={handleScrollToModeInfo}
    />
  );

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

  let i18nKey: string | undefined;

  if (isAvailableInEMode && isAvailableInIsolation) {
    i18nKey = 'assetWarning.modeOnly.eModeAndIsolation';
  } else if (isAvailableInEMode) {
    i18nKey = 'assetWarning.modeOnly.eMode';
  } else if (isAvailableInIsolation) {
    i18nKey = 'assetWarning.modeOnly.isolation';
  }

  if (!i18nKey) {
    return null;
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
