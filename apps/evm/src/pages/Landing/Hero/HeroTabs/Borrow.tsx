import { Button, Icon, Tooltip, cn } from 'components';
import { routes } from 'constants/routing';
import { useTranslation } from 'libs/translations';
import { Link } from 'react-router';
import { CoinWithLogo, type CoinWithLogoProps } from './CoinWithLogo';

const rowClassName = cn('flex justify-between items-center gap-6');

export const Borrow: React.FC<CoinWithLogoProps> = ({ asset, chain, className }) => {
  const { t, Trans } = useTranslation();
  return (
    <div className={cn('text-[20px] leading-normal font-semibold w-full', className)}>
      <div className={rowClassName}>
        <div className="text-light-grey-active">{t('landing.hero.totalApy')}</div>
        <div className="text-yellow text-end">
          {t('landing.hero.fromPercentage', { percentage: '6.17%' /* TODO: fetch from BE */ })}
        </div>
      </div>

      <div className={cn(rowClassName, 'mt-6 py-4 sm:py-0')}>
        <CoinWithLogo asset={asset} chain={chain} />
        <div className="flex items-center justify-end text-end text-light-grey gap-1.5">
          {'$10,000' /* TODO */}
          <Tooltip
            content={<Trans i18nKey={'landing.hero.borrowTips'} components={{ br: <br /> }} />}
          >
            <Icon
              name="info"
              className="size-3.5 hover:text-light-grey-hover hover:cursor-pointer duration-[250]"
            />
          </Tooltip>
        </div>
      </div>

      <div className={cn(rowClassName, 'mt-6', 'text-white text-[14px] sm:text-[16px]')}>
        <div className="font-normal">{t('landing.hero.yearlyInterest')}</div>
        <div className="text-end">{'≈$42' /* TODO */}</div>
      </div>

      <Link to={routes.dashboard.path}>
        <Button className="mt-6 h-12 w-full" variant="tertiary">
          {t('landing.hero.getStarted')}
        </Button>
      </Link>
    </div>
  );
};
