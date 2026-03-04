import { cn } from '@venusprotocol/ui';

import { Card, Icon } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import type { To } from 'react-router';

export interface StepCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  isCompleted: boolean;
  isCollapsed: boolean;
  to: To;
}

export const StepCard: React.FC<StepCardProps> = ({
  title,
  description,
  isCompleted,
  isCollapsed,
  to,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const iconDom = <Icon name={isCompleted ? 'check' : 'pending'} className="size-5 text-inherit" />;

  return (
    <Card asChild {...otherProps}>
      <Link
        to={to}
        className={cn(
          'p-3 flex flex-col justify-between text-white hover:no-underline hover:text-white hover:border-blue active:text-white',
          !isCollapsed && 'h-41',
          className,
        )}
      >
        <div className={cn(!isCollapsed && 'space-y-3')}>
          <div className="flex items-center gap-x-2">
            <div
              className={cn(
                !isCollapsed && 'hidden',
                isCompleted ? 'text-green' : 'text-light-grey',
              )}
            >
              {iconDom}
            </div>

            <p className="font-semibold">{title}</p>
          </div>

          <p className={cn('text-light-grey text-xs', isCollapsed && 'hidden')}>{description}</p>
        </div>

        <div
          className={cn(
            'flex items-center gap-x-2',
            isCompleted ? 'text-green' : 'text-light-grey',
            isCollapsed && 'hidden',
          )}
        >
          {iconDom}

          <p className="text-xs">
            {isCompleted ? t('dashboard.guide.completed') : t('dashboard.guide.uncompleted')}
          </p>
        </div>
      </Link>
    </Card>
  );
};
