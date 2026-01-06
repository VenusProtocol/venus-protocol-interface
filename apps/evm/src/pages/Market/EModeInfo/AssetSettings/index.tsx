import { cn } from '@venusprotocol/ui';

import lightningIllustrationSrc from 'assets/img/lightning.svg';
import { MarketStatus } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatPercentageToReadableValue } from 'utilities';
import { Setting } from './Setting';

export interface AssetSettingsProps {
  eModeGroupName: string;
  token: Token;
  collateralFactor: number;
  isBorrowable: boolean;
  liquidationThresholdPercentage: number;
  liquidationPenaltyPercentage: number;
  isLast: boolean;
}

export const AssetSettings: React.FC<AssetSettingsProps> = ({
  eModeGroupName,
  token,
  collateralFactor,
  isBorrowable,
  liquidationThresholdPercentage,
  liquidationPenaltyPercentage,
  isLast,
}) => {
  const { t } = useTranslation();

  const readableMaxLtvPercentage = formatPercentageToReadableValue(collateralFactor * 100);

  return (
    <div
      className={cn(
        'space-y-4 md:flex md:justify-between md:items-start md:space-y-0 lg:space-y-4 lg:block xxl:flex xxl:space-y-0 xxl:justify-start xxl:gap-x-6',
        !isLast && 'border-lightGrey border-b pb-4 sm:pb-0 sm:border-none lg:border-b lg:pb-0',
      )}
    >
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-2 xxl:w-50">
          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-lightGrey">
            <img
              src={lightningIllustrationSrc}
              className="h-3"
              alt={t('markets.tabs.eMode.illustrationAltText')}
            />
          </div>

          <span className="font-semibold">{eModeGroupName}</span>
        </div>

        <MarketStatus
          isBorrowable={isBorrowable}
          canBeCollateral={collateralFactor > 0}
          className="hidden sm:flex md:hidden lg:flex xxl:hidden"
        />
      </div>

      <div className="space-y-4">
        <MarketStatus
          isBorrowable={isBorrowable}
          canBeCollateral={collateralFactor > 0}
          className="sm:hidden md:flex lg:hidden xxl:flex"
        />

        <div
          className={cn(
            'space-y-4 sm:flex sm:gap-x-6 sm:items-start sm:space-y-0',
            !isLast && 'border-lightGrey sm:border-b sm:pb-5',
          )}
        >
          <Setting
            label={t('markets.tabs.eMode.maxLtv.label')}
            value={readableMaxLtvPercentage}
            className="whitespace-nowrap"
            tooltip={t('markets.tabs.eMode.maxLtv.tooltip', {
              maxLtv: readableMaxLtvPercentage,
              userCollateralFactor: collateralFactor,
              tokenSymbol: token.symbol,
            })}
          />

          <Setting
            label={t('markets.tabs.eMode.liquidationThreshold.label')}
            value={formatPercentageToReadableValue(liquidationThresholdPercentage)}
            className="whitespace-nowrap"
          />

          <Setting
            label={t('markets.tabs.eMode.liquidationPenalty.label')}
            value={formatPercentageToReadableValue(liquidationPenaltyPercentage)}
            className="whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
};
