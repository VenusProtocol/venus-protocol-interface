import { cn } from 'utilities';

import { TextButton } from '../Button';
import { Icon, type IconName } from '../Icon';
import { Spinner } from '../Spinner';
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
  ...otherProps
}: NoticeProps) => (
  <div
    className={cn(
      'relative bg-background rounded-xl border transition-colors overflow-hidden',
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
        'flex px-4 py-3 transition-colors ease-linear',
        variant === 'error' && 'bg-red/5',
        variant === 'success' && 'bg-green/5',
        variant === 'warning' && 'bg-orange/5',
      )}
    >
      <div className="flex grow overflow-hidden">
        {variant === 'loading' ? (
          <Spinner variant="small" className="mr-3 shrink-0 items-start" />
        ) : (
          <Icon
            className={cn(
              'mr-3 h-5 w-5 shrink-0',
              variant === 'info' && 'text-blue',
              variant === 'error' && 'text-red',
              variant === 'success' && 'text-green',
              variant === 'warning' && 'text-orange',
            )}
            name={iconMapping[variant]}
          />
        )}

        <div className="grow overflow-hidden break-words">
          {title && <p className="mb-2 text-sm font-semibold">{title}</p>}

          <p className="text-sm">{description}</p>
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
