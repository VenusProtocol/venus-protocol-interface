import { Icon, type IconName } from 'components';
import { useMemo } from 'react';
import { cn } from 'utilities';

export interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'info' | 'success' | 'error';
  status: string;
  description?: string;
  subDescription?: string;
}

export const Status: React.FC<StatusProps> = ({
  type,
  status,
  description,
  subDescription,
  ...otherProps
}) => {
  const [colorClass, iconName] = useMemo<[string, IconName]>(() => {
    if (type === 'success') {
      return ['text-green', 'mark'];
    }

    if (type === 'error') {
      return ['text-red', 'close'];
    }

    return ['text-offWhite', 'dots'];
  }, [type]);

  return (
    <div {...otherProps}>
      <div className={cn('flex items-center justify-end gap-x-1', colorClass)}>
        <Icon className="text-inherit w-5 h-5" name={iconName} />

        <span className="text-sm font-semibold">{status}</span>
      </div>

      {(description || subDescription) && (
        <div className="mt-1 text-xs text-right">
          {description && <p className="text-grey">{description}</p>}

          {subDescription && <p>{subDescription}</p>}
        </div>
      )}
    </div>
  );
};
