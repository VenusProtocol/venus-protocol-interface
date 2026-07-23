import { cn } from '@venusprotocol/ui';
import type { Token } from 'types';

import { InfoIcon } from 'components/InfoIcon';
import { Icon, type IconName } from '../Icon';
import { TokenIcon } from '../TokenIcon';

export interface LabeledInlineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  children: React.ReactNode;
  invertTextColors?: boolean;
  iconSrc?: IconName | Token;
  iconClassName?: string;
  labelClassName?: string;
}

export const LabeledInlineContent = ({
  label,
  tooltip,
  iconSrc,
  iconClassName,
  invertTextColors = false,
  children,
  className,
  description,
  labelClassName,
  ...otherContainerProps
}: LabeledInlineContentProps) => (
  <div className={cn('flex w-full justify-between space-x-4', className)} {...otherContainerProps}>
    <div className={cn('flex items-center text-sm', labelClassName)}>
      <div className={cn('flex', !description && 'items-center')}>
        {typeof iconSrc === 'string' && (
          <Icon
            name={iconSrc}
            className={cn('mr-2 h-5 w-5', !description && '-mt-[2px]', iconClassName)}
          />
        )}

        {!!iconSrc && typeof iconSrc !== 'string' && (
          <TokenIcon token={iconSrc} className={cn('mr-2 h-5 w-5', !description && '-mt-[2px]')} />
        )}

        <div className={cn(description && '-mt-[2px]')}>
          <div className={cn('text-b1r', invertTextColors ? 'text-white' : 'text-grey')}>
            {label}
          </div>

          {!!description && (
            <div className={cn('text-b2r', invertTextColors ? 'text-white' : 'text-grey')}>
              {description}
            </div>
          )}
        </div>
      </div>

      {!!tooltip && <InfoIcon className="ml-2 inline-flex items-center" tooltip={tooltip} />}
    </div>

    <div className={cn('flex items-center text-sm', invertTextColors ? 'text-grey' : 'text-white')}>
      {children}
    </div>
  </div>
);
