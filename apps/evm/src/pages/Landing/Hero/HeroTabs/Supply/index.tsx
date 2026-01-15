import { Button, Icon, Tooltip, cn, theme } from 'components';
import { Subdirectory, routes } from 'constants/routing';
import { useTranslation } from 'libs/translations';
import { BarChart } from 'pages/Landing/Hero/HeroTabs/Supply/BarChart';
import { Link } from 'react-router';
import { CoinWithLogo, type CoinWithLogoProps } from '../CoinWithLogo';

const rowClassName = cn('flex justify-between items-center gap-6');

export const DEFAULT_AMOUNT = 10_000;

export const Supply: React.FC<CoinWithLogoProps> = ({ asset, chain, className }) => {
  const { t, Trans } = useTranslation();
  const apy = 0.1;

  const data = [
    { month: 0, amount: 20, asset },
    { month: 1, amount: 25, asset },
    { month: 2, amount: 32, asset },
    { month: 3, amount: 38, asset },
    { month: 4, amount: 46, asset },
    { month: 5, amount: 56, asset },
    { month: 6, amount: 68, asset },
    { month: 7, amount: 82, asset },
    { month: 8, amount: 38, asset },
    { month: 9, amount: 46, asset },
    { month: 10, amount: 56, asset },
    { month: 11, amount: 68, asset },
    { month: 12, amount: 82, asset },
    { month: 13, amount: 38, asset },
    { month: 14, amount: 46, asset },
    { month: 15, amount: 56, asset },
    { month: 16, amount: 68, asset },
    { month: 17, amount: 82, asset },
    { month: 18, amount: 38, asset },
    { month: 19, amount: 46, asset },
    { month: 20, amount: 56, asset },
    { month: 21, amount: 68, asset },
    { month: 22, amount: 32, asset },
    { month: 23, amount: 38, asset },
  ]; /* TODO */

  return (
    <div className={cn('text-[20px] leading-normal font-semibold w-full', className)}>
      <div className={rowClassName}>
        <div className="text-light-grey-active">{t('landing.hero.highestApy')}</div>
        <div className="text-green">
          {t('landing.hero.upToPercentage', { percentage: '4.17%' /* TODO: fetch from BE */ })}
        </div>
      </div>

      <div className={cn(rowClassName, 'mt-6 py-4 sm:py-0')}>
        <CoinWithLogo asset={asset} chain={chain} />
        <div className="flex items-center justify-end text-light-grey gap-1.5">
          {'$10,000' /* TODO */}
          <Tooltip
            content={<Trans i18nKey={'landing.hero.supplyTips'} components={{ br: <br /> }} />}
          >
            <Icon
              name="info"
              className="size-3.5 hover:text-light-grey-hover hover:cursor-pointer duration-[250]"
            />
          </Tooltip>
        </div>
      </div>

      <BarChart
        data={data}
        xAxisDataKey={'month'}
        yAxisDataKey={'amount'}
        formatXAxisValue={value => value}
        formatYAxisValue={value => value}
        chartColor={theme.colors.blue}
      />

      <div
        className={cn(
          'hidden sm:flex justify-between items-center mt-3 font-normal text-[16px] leading-normal',
        )}
      >
        <div>{t('landing.hero.yearlyEarnings')}</div>
        <div className="font-semibold">{'$420' /* TODO: daily earning amount */}</div>
      </div>

      <Link to={routes.dashboard.path}>
        <Button className="mt-6 h-12 w-full" variant="tertiary">
          {t('landing.hero.getStarted')}
        </Button>
      </Link>
    </div>
  );
};
