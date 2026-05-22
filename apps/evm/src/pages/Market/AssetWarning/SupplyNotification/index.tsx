import { TextButton } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';
import type { Asset, Pool } from 'types';
import { areTokensEqual, scrollToElement } from 'utilities';

export interface SupplyNotificationProps {
  asset: Asset;
  pool: Pool;
  onShowAllMarkets: () => void;
}

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

  if (!isAvailableInCore) {
    let i18nKey: string | undefined;

    if (isAvailableInEMode && isAvailableInIsolation) {
      // t('assetWarning.modeOnly.eModeAndIsolation')
      i18nKey = 'assetWarning.modeOnly.eModeAndIsolation';
    } else if (isAvailableInEMode) {
      // t('assetWarning.modeOnly.eMode')
      i18nKey = 'assetWarning.modeOnly.eMode';
    } else if (isAvailableInIsolation) {
      // t('assetWarning.modeOnly.isolation')
      i18nKey = 'assetWarning.modeOnly.isolation';
    }

    if (!i18nKey) {
      return null;
    }

    return (
      <Trans
        i18nKey={i18nKey}
        values={{ tokenSymbol }}
        components={{ Button: showAllMarketsButton, ModeInfoButton: modeInfoButton }}
      />
    );
  }

  const hasMode = isAvailableInEMode || isAvailableInIsolation;

  return (
    <>
      <Trans
        // t('assetWarning.supplyDescription')
        i18nKey="assetWarning.supplyDescription"
        values={{ tokenSymbol }}
        components={{ Button: showAllMarketsButton }}
      />

      {hasMode && (
        <Trans
          // t('assetWarning.modeInfoHint')
          i18nKey="assetWarning.modeInfoHint"
          components={{ LineBreak: <br />, ModeInfoButton: modeInfoButton }}
        />
      )}
    </>
  );
};
