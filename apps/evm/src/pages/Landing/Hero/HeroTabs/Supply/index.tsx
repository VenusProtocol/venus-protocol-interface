import { Icon, TokenIconWithSymbol, Tooltip, cn, theme } from 'components';
import { useIsSmDown } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { BarChart } from 'pages/Landing/Hero/HeroTabs/Supply/BarChart';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import { BASE_AMOUNT, type Props, StartNowBtn } from '../shared';
import { EarningTabs } from './EarningTabs';
import { calcSupplyEarnings } from './utils';

const rowClassName = cn('flex justify-between items-center gap-6');

export const Supply: React.FC<Props> = ({ token, apy, className }) => {
  const { t } = useTranslation();

  const showTab = useIsSmDown();

  const data = calcSupplyEarnings(apy);

  return (
    <div className={cn('text-b1s sm:text-p2s w-full', className)}>
      <div className={rowClassName}>
        <div className="text-light-grey-active">{t('landing.hero.highestApy')}</div>
        <div className="text-green">
          {t('landing.hero.upToPercentage', { percentage: formatPercentageToReadableValue(apy) })}
        </div>
      </div>

      <div className={cn(rowClassName, 'mt-6 py-4 sm:py-0')}>
        <TokenIconWithSymbol token={token} displayChain tokenIconClassName="sm:size-13" />
        <div className="flex items-center justify-end text-light-grey gap-1.5">
          {formatCentsToReadableValue({ value: BASE_AMOUNT * 100, isTokenPrice: true })}
          <Tooltip content={t('landing.hero.supplyTips')}>
            <Icon
              name="info"
              className="size-3.5 hover:text-light-grey-hover hover:cursor-pointer duration-[250]"
            />
          </Tooltip>
        </div>
      </div>

      {showTab ? (
        <EarningTabs data={data} />
      ) : (
        <BarChart
          data={data}
          xAxisDataKey={'month'}
          yAxisDataKey={'currAmount'}
          formatXAxisValue={value => value}
          formatYAxisValue={value => value}
          chartColor={theme.colors.blue}
        />
      )}

      <div className={cn('hidden sm:flex justify-between items-center mt-3')}>
        <div className="text-b1r sm:text-p3r">{t('landing.hero.yearlyEarnings')}</div>
        <div className="text-b1s sm:text-p3s text-end">
          {formatCentsToReadableValue({ value: (data[data.length - 1].cumAmount - 10_000) * 100 })}
        </div>
      </div>

      <StartNowBtn />
    </div>
  );
};
