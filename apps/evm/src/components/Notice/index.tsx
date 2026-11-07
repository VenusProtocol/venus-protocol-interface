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
  onClose,
  size = 'md',
  ...otherProps
}: NoticeProps) => (
  <div
    className={cn(
      'relative bg-surface-2 rounded-lg border transition-colors overflow-hidden',
      (variant === 'info' || variant === 'loading') && 'border-muted',
      variant === 'error' && 'border-danger',
      variant === 'success' && 'border-success',
      variant === 'warning' && 'border-caution',
      className,
    )}
    {...otherProps}
  >
    <div
      className={cn(
        'flex transition-colors ease-linear px-3 py-2',
        size === 'md' && 'md:px-4 md:py-3',
        variant === 'info' && 'bg-brand/5',
        variant === 'error' && 'bg-danger/5',
        variant === 'success' && 'bg-success/5',
        variant === 'warning' && 'bg-caution/5',
      )}
    >
      <div className="flex grow overflow-hidden">
        <div className="h-[18px] mr-2 shrink-0 flex items-center md:h-[20px]">
          {variant === 'loading' ? (
            <Spinner variant="small" className="items-start" />
          ) : (
            <Icon
              className={cn(
                'h-4 w-4',
                size === 'md' && 'md:h-5 md:w-5',
                variant === 'info' && 'text-brand',
                variant === 'error' && 'text-danger',
                variant === 'success' && 'text-success',
                variant === 'warning' && 'text-caution',
              )}
              name={iconMapping[variant]}
            />
          )}
        </div>

        <div className="grow overflow-hidden wrap-break-word space-y-2">
          {title && <p className="text-sm font-semibold">{title}</p>}

          {!!description && (
            <div className={cn('text-xs', size === 'md' && 'md:text-sm')}>{description}</div>
          )}
        </div>
      </div>

      {onClose && (
        <TextButton className="group h-5 p-0" onClick={onClose}>
          <Icon name="close" className="group-hover:text-primary h-5 w-5 transition-colors" />
        </TextButton>
      )}
    </div>
  </div>
);

export const NoticeInfo = (props: NoticeProps) => <Notice variant="info" {...props} />;
export const NoticeError = (props: NoticeProps) => <Notice variant="error" {...props} />;
export const NoticeWarning = (props: NoticeProps) => <Notice variant="warning" {...props} />;
export const NoticeSuccess = (props: NoticeProps) => <Notice variant="success" {...props} />;
