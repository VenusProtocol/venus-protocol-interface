import type { Token } from 'types';
import { cn } from 'utilities';

import { Icon, type IconName } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import { Tooltip } from '../Tooltip';

export interface LabeledInlineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  invertTextColors?: boolean;
  iconSrc?: IconName | Token;
  iconClassName?: string;
}

export const LabeledInlineContent = ({
  label,
  tooltip,
  iconSrc,
  iconClassName,
  invertTextColors = false,
  children,
  className,
  ...otherContainerProps
}: LabeledInlineContentProps) => (
  <div
    className={cn('flex w-full items-center justify-between space-x-4', className)}
    {...otherContainerProps}
  >
    <div className="flex items-center text-sm md:text-base">
      {typeof iconSrc === 'string' && (
        <Icon name={iconSrc} className={cn('-mt-[2px] mr-2 h-5 w-5', iconClassName)} />
      )}

      {!!iconSrc && typeof iconSrc !== 'string' && (
        <TokenIcon token={iconSrc} className="-mt-[2px] mr-2 h-5 w-5" />
      )}

      <p className={cn('text-sm md:text-base', invertTextColors ? 'text-offWhite' : 'text-grey')}>
        {label}
      </p>

      {!!tooltip && (
        <Tooltip className="ml-2 inline-flex items-center" title={tooltip}>
          <Icon className="cursor-help" name="info" />
        </Tooltip>
      )}
    </div>

    <div
      className={cn(
        'flex items-center text-sm md:text-base',
        invertTextColors ? 'text-grey' : 'text-offWhite',
      )}
    >
      {children}
    </div>
  </div>
);
