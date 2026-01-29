import type BigNumber from 'bignumber.js';

import { MONTHS_PER_YEAR } from 'constants/time';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import { Row } from '../../Row';
import { calculateInterests } from '../calculateInterests';
import { BASE_AMOUNT_CENTS } from '../constants';

export interface InterestsProps {
  borrowApyPercentage: BigNumber;
}

export const Interests: React.FC<InterestsProps> = ({ borrowApyPercentage }) => {
  const { t } = useTranslation();

  const interestsCents = calculateInterests({
    amount: BASE_AMOUNT_CENTS,
    months: MONTHS_PER_YEAR,
    apyPercentage: borrowApyPercentage.toNumber(),
  });
  const readableInterests = formatCentsToReadableValue({ value: interestsCents });

  return (
    <Row className="">
      <p className="text-b1r sm:text-p3r">{t('landing.hero.yearlyInterests')}</p>

      <p className="text-b1s sm:text-p3s">{readableInterests}</p>
    </Row>
  );
};
