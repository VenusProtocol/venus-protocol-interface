import { Icon, Tooltip, cn } from 'components';
import { TokenIconWithSymbol } from 'components/TokenIconWithSymbol';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import { BASE_AMOUNT, type Props, StartNowBtn } from '../shared';
import { calcBorrowInterest } from './utils';

const rowClassName = cn('flex justify-between items-center gap-6');

export const Borrow: React.FC<Props> = ({ token, apy, className }) => {
  const { t, Trans } = useTranslation();

  const interest = calcBorrowInterest(apy);

  return (
    <div className={cn('text-b1s sm:text-p2s w-full', className)}>
      <div className={rowClassName}>
        <div className="text-light-grey-active">{t('landing.hero.totalApy')}</div>
        <div className="text-yellow text-end">
          {t('landing.hero.fromPercentage', { percentage: formatPercentageToReadableValue(apy) })}
        </div>
      </div>

      <div className={cn(rowClassName, 'mt-6 py-4 sm:py-0')}>
        <TokenIconWithSymbol token={token} displayChain tokenIconClassName="sm:size-13" />
        <div className="flex items-center justify-end text-end text-light-grey gap-1.5">
          {formatCentsToReadableValue({ value: BASE_AMOUNT * 100, isTokenPrice: true })}
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

      <div className={cn(rowClassName, 'mt-6', 'text-white')}>
        <div className="text-b1r sm:text-p3r">{t('landing.hero.yearlyInterest')}</div>
        <div className="text-b1s sm:text-p3s text-end">{`≈ ${interest}`}</div>
      </div>

      <StartNowBtn />
    </div>
  );
};
