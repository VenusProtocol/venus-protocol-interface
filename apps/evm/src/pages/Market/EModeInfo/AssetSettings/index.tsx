import { cn } from '@venusprotocol/ui';

import lightningIllustrationSrc from 'assets/img/lightning.svg';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatPercentageToReadableValue } from 'utilities';
import { Setting } from './Setting';

export interface AssetSettingsProps {
  eModeGroupName: string;
  token: Token;
  collateralFactor: number;
  liquidationThresholdPercentage: number;
  liquidationPenaltyPercentage: number;
  isLast: boolean;
}

export const AssetSettings: React.FC<AssetSettingsProps> = ({
  eModeGroupName,
  token,
  collateralFactor,
  liquidationThresholdPercentage,
  liquidationPenaltyPercentage,
  isLast,
}) => {
  const { t } = useTranslation();

  const readableMaxLtvPercentage = formatPercentageToReadableValue(collateralFactor * 100);

  return (
    <div
      className={cn(
        'space-y-4 md:flex md:justify-between md:items-start md:space-y-0 lg:space-y-4 lg:block xxl:flex xxl:space-y-0',
        !isLast && 'border-lightGrey border-b pb-4 sm:pb-0 sm:border-none lg:border-b lg:pb-0',
      )}
    >
      <div className="flex items-center gap-x-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-lightGrey">
          <img
            src={lightningIllustrationSrc}
            className="h-3"
            alt={t('pool.tabs.eMode.illustrationAltText')}
          />
        </div>

        <span className="font-semibold">{eModeGroupName}</span>
      </div>

      <div
        className={cn(
          'space-y-4 sm:flex sm:gap-x-6 sm:items-start sm:space-y-0',
          !isLast && 'border-lightGrey sm:border-b sm:pb-5',
        )}
      >
        <Setting
          label={t('pool.tabs.eMode.maxLtv.label')}
          value={readableMaxLtvPercentage}
          className="whitespace-nowrap"
          tooltip={t('pool.tabs.eMode.maxLtv.tooltip', {
            maxLtv: readableMaxLtvPercentage,
            userCollateralFactor: collateralFactor,
            tokenSymbol: token.symbol,
          })}
        />

        <Setting
          label={t('pool.tabs.eMode.liquidationThreshold.label')}
          value={formatPercentageToReadableValue(liquidationThresholdPercentage)}
          className="whitespace-nowrap"
        />

        <Setting
          label={t('pool.tabs.eMode.liquidationPenalty.label')}
          value={formatPercentageToReadableValue(liquidationPenaltyPercentage)}
          className="whitespace-nowrap"
        />
      </div>
    </div>
  );
};
