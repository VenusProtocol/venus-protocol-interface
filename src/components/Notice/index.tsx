import { cn } from 'utilities';

import { TextButton } from '../Button';
import { Icon, IconName } from '../Icon';
import { Spinner } from '../Spinner';
import { NoticeProps, NoticeVariant } from './types';

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
      'relative flex overflow-hidden rounded-xl border p-2 transition-colors before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-[-1] before:bg-background before:transition-colors',
      (variant === 'info' || variant === 'loading') && 'border-lightGrey',
      variant === 'error' && 'border-red bg-red/5',
      variant === 'success' && 'border-green bg-green/5',
      variant === 'warning' && 'border-orange bg-orange/5',
      className,
    )}
    {...otherProps}
  >
    <div className="flex grow overflow-hidden p-2">
      {variant === 'loading' ? (
        <Spinner variant="small" className="mr-3 shrink-0" />
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
        <Icon name="close" className="h-5 w-5 transition-colors group-hover:text-offWhite" />
      </TextButton>
    )}
  </div>
);

export const NoticeInfo = (props: NoticeProps) => <Notice variant="info" {...props} />;
export const NoticeError = (props: NoticeProps) => <Notice variant="error" {...props} />;
export const NoticeWarning = (props: NoticeProps) => <Notice variant="warning" {...props} />;
export const NoticeSuccess = (props: NoticeProps) => <Notice variant="success" {...props} />;
