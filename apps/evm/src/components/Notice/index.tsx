import { cn } from '@venusprotocol/ui';

import { Spinner, TextButton } from '@venusprotocol/ui';
import { Icon, type IconName } from '../Icon';
import type { NoticeProps, NoticeVariant } from './types';

export * from './types';

const iconMapping: {
  [variant in Exclude<NoticeVariant, 'loading'>]: IconName;
} = {
  info: 'info',
  error: 'notice',
  success: 'checkInline',
  warning: 'attention',
};

export const Notice = ({
  className,
  title,
  description,
  variant = 'info',
  condensed = false,
  onClose,
  ...otherProps
}: NoticeProps) => (
  <div
    className={cn(
      'relative bg-background rounded-lg border transition-colors overflow-hidden',
      (variant === 'info' || variant === 'loading') && 'border-lightGrey',
      variant === 'error' && 'border-red',
      variant === 'success' && 'border-green',
      variant === 'warning' && 'border-orange',
      className,
    )}
    {...otherProps}
  >
    <div
      className={cn(
        'flex transition-colors ease-linear',
        condensed ? 'px-3 py-2' : 'px-4 py-3',
        variant === 'info' && 'bg-blue/5',
        variant === 'error' && 'bg-red/5',
        variant === 'success' && 'bg-green/5',
        variant === 'warning' && 'bg-orange/5',
      )}
    >
      <div className="flex grow overflow-hidden">
        {variant === 'loading' ? (
          <Spinner variant="small" className="mr-2 shrink-0 items-start" />
        ) : (
          <Icon
            className={cn(
              'mr-2 shrink-0',
              condensed ? 'h-4 w-4' : 'h-5 w-5',
              variant === 'info' && 'text-blue',
              variant === 'error' && 'text-red',
              variant === 'success' && 'text-green',
              variant === 'warning' && 'text-orange',
            )}
            name={iconMapping[variant]}
          />
        )}

        <div className="grow overflow-hidden break-words space-y-2">
          {title && <p className="text-sm font-semibold">{title}</p>}

          {!!description && <p className={condensed ? 'text-xs' : 'text-sm'}>{description}</p>}
        </div>
      </div>

      {onClose && (
        <TextButton className="group h-5 p-0" onClick={onClose}>
          <Icon name="close" className="group-hover:text-offWhite h-5 w-5 transition-colors" />
        </TextButton>
      )}
    </div>
  </div>
);

export const NoticeInfo = (props: NoticeProps) => <Notice variant="info" {...props} />;
export const NoticeError = (props: NoticeProps) => <Notice variant="error" {...props} />;
export const NoticeWarning = (props: NoticeProps) => <Notice variant="warning" {...props} />;
export const NoticeSuccess = (props: NoticeProps) => <Notice variant="success" {...props} />;
