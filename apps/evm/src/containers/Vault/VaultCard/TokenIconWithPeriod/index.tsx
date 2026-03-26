import { cn } from '@venusprotocol/ui';

import { TokenIcon, type TokenIconProps } from 'components/TokenIcon';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { formatDateToUtc } from 'utilities';

export interface TokenIconWithPeriodProps extends TokenIconProps {
  targetTime?: number;
  tokenIconClassName?: string;
}

export const TokenIconWithPeriod: React.FC<TokenIconWithPeriodProps> = ({
  token,
  className,
  targetTime,
  size = 'xl',
  ...otherProps
}) => {
  const { t } = useTranslation();

  const showDate = typeof targetTime !== 'undefined';
  const targetDate = showDate ? new Date(targetTime) : undefined;
  const now = useNow();

  const daysRemaining = targetTime
    ? Math.ceil((targetTime - now.getTime()) / (1000 * 60 * 60 * 24))
    : undefined;

  const daysRemainingStr =
    typeof daysRemaining === 'undefined'
      ? PLACEHOLDER_KEY
      : t('vault.card.numDays', { count: daysRemaining });

  const formattedDateUtc = formatDateToUtc(targetDate, {
    showPlaceholder: true,
    formatStr: 'MMM dd yyyy',
  });

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

        {daysRemaining && daysRemaining > 0 && (
          <p className={cn('truncate text-light-grey', size === 'xl' ? 'text-b2r' : 'text-b3r')}>
            {formattedDateUtc} ( {daysRemainingStr} )
          </p>
        )}
      </div>
    </div>
  );
};
