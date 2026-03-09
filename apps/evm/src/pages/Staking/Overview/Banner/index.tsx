import { PrimaryButton, cn } from '@venusprotocol/ui';
import type { ActiveModal } from 'containers/Vault';
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

  const { stakingAprPercentage, stakedToken, dailyEmissionUsdCents, userStakedUsdCents } = vault;

  const onEarnClick = () => {
    onOpenModal?.(vault, 'stake');
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-[linear-gradient(90deg,#0829AE_0%,#0254EB_100%)]',
        'p-3 md:py-3 md:px-6 lg:p-6',
        // height per breakpoint
        'h-30.5 sm:h-26.5 md:h-27.5 lg:h-46.75',
        // width: full at mobile/sm/md, fixed at lg+
        'lg:shrink-0 lg:w-106 xl:w-132.5 2xl:w-156.5',
        className,
      )}
    >
      {/* Illustration */}
      <img
        className={cn(
          'hidden sm:block absolute bottom-0 pointer-events-none',
          'sm:-right-8.5 sm:w-69.25 sm:h-35',
          'md:right-0 md:w-67.5 md:h-34.25',
          'lg:-right-7 lg:w-66 lg:h-33.5',
          'xl:-right-9.25 xl:w-84.25 xl:h-42.75',
          '2xl:right-0 2xl:w-92.75 2xl:h-47',
        )}
        aria-hidden
        src={bannerVaultSrc}
        alt="vault.overview.bannerIllustration"
      />

      {/* Content */}
      <div className={cn('relative z-10 flex flex-col gap-2')}>
        {/* Title */}
        <p className="text-b1s md:text-p3s text-grey">
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
        <div className="flex sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start gap-2">
          <div className="flex flex-col gap-1">
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

          <PrimaryButton onClick={onEarnClick} className="h-auto py-1 px-5 text-b1s rounded-lg">
            {t('vault.overview.earningNow')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
