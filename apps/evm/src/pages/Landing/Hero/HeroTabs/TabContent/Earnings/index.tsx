import type BigNumber from 'bignumber.js';

import { cn } from '@venusprotocol/ui';
import { MONTHS_PER_YEAR } from 'constants/time';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import { Row } from '../../Row';
import { calculateInterests } from '../calculateInterests';
import { BASE_AMOUNT_CENTS } from '../constants';
import type { CompoundedAmountDataPoint } from '../types';
import { BarChart } from './BarChart';
import { EarningTabs } from './EarningTabs';

export interface EarningsProps {
  supplyApyPercentage: BigNumber;
  className?: string;
}

export const Earnings: React.FC<EarningsProps> = ({ supplyApyPercentage, className }) => {
  const { t } = useTranslation();

  const data = Array.from(Array(MONTHS_PER_YEAR)).reduce<CompoundedAmountDataPoint[]>(
    (acc, _curr, index) => {
      const months = index + 1;
      const earningsCents = calculateInterests({
        amount: BASE_AMOUNT_CENTS,
        months,
        apyPercentage: supplyApyPercentage.toNumber(),
      });

      acc.push({
        months,
        amountCents: BASE_AMOUNT_CENTS + earningsCents,
        earningsCents,
      });

      return acc;
    },
    [],
  );

  const yearlyEarningsCents = data[data.length - 1].earningsCents;
  const readableYearlyEarnings = formatCentsToReadableValue({
    value: yearlyEarningsCents,
  });

  return (
    <div className={cn('space-y-3', className)}>
      <EarningTabs data={data} className="sm:hidden" />

      <BarChart className="hidden sm:block" data={data} />

      <Row>
        <p className="text-b1r sm:text-p3r">{t('landing.hero.yearlyEarnings')}</p>

        <p className="text-b1s sm:text-p3s">{readableYearlyEarnings}</p>
      </Row>
    </div>
  );
};
