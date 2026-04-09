import { useTranslation } from 'libs/translations';
import type { EModeGroup, Pool, Token } from 'types';
import { areTokensEqual } from 'utilities';
import { type ExtendedEModeAssetSettings, Mode } from './Mode';

export interface EModeInfoProps {
  token: Token;
  pool: Pool;
  eModeGroups: EModeGroup[];
}

export const EModeInfo: React.FC<EModeInfoProps> = ({ eModeGroups, token, pool }) => {
  const { t } = useTranslation();

  const eModeAssetSettings: ExtendedEModeAssetSettings[] = [];
  const isolatedEModeAssetSettings: ExtendedEModeAssetSettings[] = [];

  eModeGroups.forEach(eModeGroup => {
    const assetSettings = eModeGroup.assetSettings.find(settings =>
      areTokensEqual(token, settings.vToken.underlyingToken),
    );

    if (!assetSettings) {
      return;
    }

    const settings: ExtendedEModeAssetSettings = {
      eModeGroup,
      isEnabledByUser: eModeGroup.id === pool.userEModeGroup?.id,
      ...assetSettings,
    };

    if (eModeGroup.isIsolated) {
      isolatedEModeAssetSettings.push(settings);
    } else {
      eModeAssetSettings.push(settings);
    }
  }, []);

  if (eModeAssetSettings.length === 0 && isolatedEModeAssetSettings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {eModeAssetSettings.length > 0 && (
        <Mode
          title={t('market.eModeInfo.eMode.title')}
          tooltip={t('market.eModeInfo.eMode.tooltip')}
          eModeAssetSettings={eModeAssetSettings}
          pool={pool}
        />
      )}

      {isolatedEModeAssetSettings.length > 0 && (
        <Mode
          title={t('market.eModeInfo.isolationMode.title')}
          tooltip={t('market.eModeInfo.isolationMode.tooltip')}
          eModeAssetSettings={isolatedEModeAssetSettings}
          pool={pool}
        />
      )}
    </div>
  );
};
