import type BigNumber from 'bignumber.js';

import { cn } from '@venusprotocol/ui';
import { Delimiter } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import type { ActiveModal } from 'containers/Vault';
import { useTranslation } from 'libs/translations';
import type { Vault } from 'types';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import { Banner } from './Banner';

export interface OverviewProps {
  totalStakedUsdCents?: BigNumber;
  totalVault: number;
  highestApr: number;
  featuredVault: Vault;
  onOpenModal?: (vault: Vault, activeModal: ActiveModal) => void;
  className?: string;
}

export const Overview: React.FC<OverviewProps> = ({
  totalStakedUsdCents,
  totalVault,
  highestApr,
  featuredVault,
  onOpenModal,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn('flex flex-col gap-6 lg:gap-12 lg:flex-row lg:items-start', className)}>
      {/* Left: title, description, stats */}
      <div className="flex flex-col gap-6 flex-1">
        {/* Title + description */}
        <div className="flex flex-col gap-3">
          <h1 className="text-h6">{t('vault.overview.title')}</h1>

          <p className="text-b1r text-grey">{t('vault.overview.description')}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-b1r text-grey">{t('vault.overview.tvl')}</span>
            <span className="text-b1s">
              {totalStakedUsdCents !== undefined
                ? formatCentsToReadableValue({ value: totalStakedUsdCents })
                : PLACEHOLDER_KEY}
            </span>
          </div>

          <Delimiter vertical />

          <div className="flex flex-col gap-1">
            <span className="text-b1r text-grey">{t('vault.overview.highestApr')}</span>
            <span className="text-b1s">
              {highestApr !== undefined
                ? formatPercentageToReadableValue(highestApr)
                : PLACEHOLDER_KEY}
            </span>
          </div>

          <Delimiter vertical />

          <div className="flex flex-col gap-1">
            <span className="text-b1r text-grey">{t('vault.overview.totalVault')}</span>
            <span className="text-b1s">{totalVault}</span>
          </div>
        </div>
      </div>

      <Banner vault={featuredVault} onOpenModal={onOpenModal} />
    </div>
  );
};
