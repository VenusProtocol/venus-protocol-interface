import { PrimaryButton, cn } from '@venusprotocol/ui';
import type { ActiveModal } from 'containers/Vault';
import { useVaultUsdValues } from 'containers/Vault/hooks/useVaultUsdValues';
import { useTranslation } from 'libs/translations';
import type { Vault } from 'types';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import bannerVaultSrc from './asset/banner-vault.png';

export interface BannerProps {
  vault: Vault;
  onOpenModal?: (vault: Vault, activeModal: ActiveModal) => void;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({ vault, onOpenModal, className }) => {
  const { t, Trans } = useTranslation();

  const { stakingAprPercentage, stakedToken } = vault;
  const {
    data: { dailyEmissionUsdCents, userStakedUsdCents },
  } = useVaultUsdValues(vault);

  const onEarnClick = () => {
    onOpenModal?.(vault, 'stake');
  };

  return (
    <div
      className={cn(
        'relative overflow-visible sm:overflow-hidden rounded-lg bg-[linear-gradient(90deg,#0829AE_0%,#0254EB_100%)]',
        'flex items-center p-3 md:py-3 md:px-6 lg:p-6',
        // height per breakpoint

        // width: full at mobile/sm/md, fixed at lg+
        'lg:shrink-0 lg:w-106 xl:w-132.5 2xl:w-156.5',
        className,
      )}
    >
      {/* Illustration */}
      <img
        className={cn(
          'absolute bottom-0 pointer-events-none',
          'right-[5%] bottom-6 h-28',
          'sm:-right-8 sm:bottom-0 sm:h-32',
          'md:right-0 md:h-32',
          'lg:-right-6 lg:h-30',
          'xl:-right-7 xl:h-37',
          '2xl:right-4 2xl:h-38',
        )}
        aria-hidden
        src={bannerVaultSrc}
        alt="vault.overview.bannerIllustration"
      />

      {/* Content */}
      <div className={cn('relative z-10 flex flex-col gap-2')}>
        {/* Title */}
        <p className="text-b1s md:text-p3s text-grey max-sm:max-w-2/3">
          <Trans
            i18nKey="vault.overview.bannerTitle"
            components={{
              strong: <strong className="text-light-grey-active font-semibold" />,
            }}
            values={{
              apyPercentage: formatPercentageToReadableValue(stakingAprPercentage),
              tokenDashMarket: `${stakedToken.symbol} `,
            }}
          />
        </p>

        {/* Stats + CTA: row on sm/md, column on lg+ */}
        <div className="flex sm:flex-row items-end sm:justify-between lg:flex-col lg:items-start gap-3">
          <div className="flex flex-col gap-1 ">
            <div className="flex items-center gap-1">
              <span className="text-b1r text-grey">{t('vault.overview.dailyEmission')}</span>
              <span className="text-b1s">
                {formatCentsToReadableValue({ value: dailyEmissionUsdCents })}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-b1r text-grey">{t('vault.overview.totalStaked')}</span>
              <span className="text-b1s">
                {formatCentsToReadableValue({ value: userStakedUsdCents })}
              </span>
            </div>
          </div>

          <PrimaryButton
            onClick={onEarnClick}
            className="h-7.5 py-1 px-5 text-b1s rounded-lg max-sm:px-4"
            size="xs"
          >
            {t('vault.overview.earningNow')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
