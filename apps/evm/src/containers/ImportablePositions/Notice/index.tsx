import { cn } from '@venusprotocol/ui';
import { BigNumber } from 'bignumber.js';
import { NoticeInfo } from 'components';
import {
  MAX_POSITION_SUPPLY_BALANCE_CENTS,
  MIN_POSITION_SUPPLY_BALANCE_CENTS,
} from 'constants/importPositions';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';

export interface NoticeProps {
  className?: string;
}

export const Notice: React.FC<NoticeProps> = ({ className }) => {
  const { Trans } = useTranslation();

  const minValueDollars = formatCentsToReadableValue({
    value: new BigNumber(MIN_POSITION_SUPPLY_BALANCE_CENTS.toString()),
  });

  const maxValueDollars = formatCentsToReadableValue({
    value: new BigNumber(MAX_POSITION_SUPPLY_BALANCE_CENTS.toString()),
  });

  return (
    <NoticeInfo
      className={cn('text-grey bg-transparent', className)}
      description={
        <Trans
          i18nKey="importPositionsModal.limitNotice"
          components={{
            Number: <span className="text-white" />,
          }}
          values={{
            min: minValueDollars,
            max: maxValueDollars,
          }}
        />
      }
    />
  );
};
