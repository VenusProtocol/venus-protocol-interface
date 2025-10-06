import { useTranslation } from 'libs/translations';
import type { EModeGroup, Token } from 'types';
import { areTokensEqual } from 'utilities';
import { MarketCard } from '../MarketCard';
import { AssetSettings, type AssetSettingsProps } from './AssetSettings';

export interface EModeInfoProps {
  eModeGroups: EModeGroup[];
  token: Token;
}

export const EModeInfo: React.FC<EModeInfoProps> = ({ eModeGroups, token }) => {
  const { t } = useTranslation();
  const assetSettingsProps = eModeGroups.reduce<Omit<AssetSettingsProps, 'isLast'>[]>(
    (acc, eModeGroup) => {
      const assetSettings = eModeGroup.assetSettings.find(settings =>
        areTokensEqual(token, settings.vToken.underlyingToken),
      );

      if (!assetSettings) {
        return acc;
      }

      const props: Omit<AssetSettingsProps, 'isLast'> = {
        eModeGroupName: eModeGroup.name,
        token: assetSettings.vToken.underlyingToken,
        collateralFactor: assetSettings.collateralFactor,
        isBorrowable: assetSettings.isBorrowable,
        liquidationThresholdPercentage: assetSettings.liquidationThresholdPercentage,
        liquidationPenaltyPercentage: assetSettings.liquidationPenaltyPercentage,
      };

      return [...acc, props];
    },
    [],
  );

  if (assetSettingsProps.length === 0) {
    return null;
  }

  return (
    <MarketCard title={t('asset.eModeInfo.title')}>
      <div className="space-y-4 sm:space-y-5">
        {assetSettingsProps.map((props, index) => (
          <AssetSettings
            {...props}
            isLast={index === assetSettingsProps.length - 1}
            key={props.eModeGroupName}
          />
        ))}
      </div>
    </MarketCard>
  );
};
