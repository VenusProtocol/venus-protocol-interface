import { cn } from '@venusprotocol/ui';

import { TokenIcon, type TokenIconProps } from 'components/TokenIcon';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { formatDateToUtc } from 'utilities';

export interface TokenIconWithPeriodProps extends TokenIconProps {
  targetDate?: Date;
  tokenIconClassName?: string;
}

export const TokenIconWithPeriod: React.FC<TokenIconWithPeriodProps> = ({
  token,
  className,
  targetDate,
  size = 'xl',
  ...otherProps
}) => {
  const { t } = useTranslation();
  const now = useNow();

  const showDate = typeof targetDate !== 'undefined';

  const daysRemaining = showDate
    ? Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : undefined;

  const daysRemainingStr =
    daysRemaining && daysRemaining > 0
      ? t('vault.card.numDays', { count: daysRemaining })
      : undefined;

  const formattedDateUtc = targetDate
    ? t('vault.card.textualDate', {
        date: formatDateToUtc(targetDate),
      })
    : PLACEHOLDER_KEY;

  return (
    <div
      className={cn('flex min-w-0 items-center', size === 'xl' ? 'gap-x-3' : 'gap-x-2', className)}
    >
      <TokenIcon token={token} className="shrink-0" size={size} {...otherProps} />

      <div className="min-w-0">
        <p
          className={cn(
            'truncate font-semibold',
            targetDate && size === 'xl' && 'text-b1r',
            targetDate && size === 'md' && 'text-b2r',
          )}
        >
          {token.symbol}
        </p>

        {showDate && (
          <p className={cn('truncate text-light-grey', size === 'xl' ? 'text-b2r' : 'text-b3r')}>
            {formattedDateUtc} {daysRemainingStr ? `( ${daysRemainingStr} )` : ''}
          </p>
        )}
      </div>
    </div>
  );
};
