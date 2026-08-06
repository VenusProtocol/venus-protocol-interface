import { cn } from '@venusprotocol/ui';
import { Icon, type IconName } from 'components';
import { Link } from 'containers/Link';

export interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'info' | 'success' | 'error';
  status: string;
  statusHref?: string;
  description?: string;
  subDescription?: string;
}

export const Status: React.FC<StatusProps> = ({
  type,
  status,
  statusHref,
  description,
  subDescription,
  ...otherProps
}) => {
  let colorClass = 'text-white';
  let iconName: IconName = 'dots';

  if (type === 'success') {
    colorClass = 'text-green';
    iconName = 'mark';
  } else if (type === 'error') {
    colorClass = 'text-red';
    iconName = 'close';
  }

  const statusDom = (
    <div className="flex items-center space-x-1">
      <Icon className="text-inherit w-5 h-5" name={iconName} />
      <span className="text-sm font-semibold">{status}</span>
    </div>
  );

  return (
    <div {...otherProps}>
      <div className={cn('flex justify-end gap-x-1', colorClass)}>
        {statusHref ? (
          <Link href={statusHref} className={cn('underline', colorClass)}>
            {statusDom}
          </Link>
        ) : (
          statusDom
        )}
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
