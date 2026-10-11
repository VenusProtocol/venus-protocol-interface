import { cn } from '@venusprotocol/ui';

import { Icon } from 'components';
import { Link } from 'containers/Link';
import { matchPath, useLocation } from 'react-router';
import { Tag } from '../../../Tag';
import type { MenuItem, SubMenu } from '../../../types';

export interface SubMenuItemProps extends MenuItem {
  variant?: SubMenu['variant'];
  onClick?: () => void;
}

export const SubMenuItem: React.FC<SubMenuItemProps> = ({
  to,
  href,
  label,
  description,
  imgSrc,
  iconName,
  tagLabel,
  onClick,
  variant,
}) => {
  const { pathname } = useLocation();

  const isActive = to && !!matchPath(to, pathname);

  const linkNavProps = to ? { to } : { href };

  return (
    <Link
      {...linkNavProps}
      onClick={onClick}
      className={cn(
        'block rounded-lg group transition-colors hover:no-underline',
        variant === 'secondary'
          ? 'p-2 hover:bg-dark-blue-active focus-visible:bg-dark-blue-active'
          : 'py-3 px-4 bg-background-active hover:bg-background-hover',
        isActive && (variant === 'secondary' ? 'bg-dark-blue-active' : 'bg-background-hover'),
      )}
    >
      <div className="flex gap-x-3">
        {(iconName || imgSrc) && (
          <div
            className={cn(
              'rounded-lg shrink-0 flex items-center justify-center',
              variant === 'secondary' ? 'size-10' : 'size-12',
              !!iconName && 'bg-dark-blue',
            )}
          >
            {iconName ? (
              <Icon
                name={iconName}
                className={cn(
                  'text-light-grey size-6 transition-colors group-hover:text-white',
                  isActive && 'text-white',
                )}
              />
            ) : (
              <img
                src={imgSrc}
                alt={label}
                className={variant === 'secondary' ? 'size-10' : 'size-12'}
              />
            )}
          </div>
        )}

        <div className={cn('flex flex-col', variant === 'secondary' && 'w-52 shrink-0')}>
          <div className="flex items-center gap-x-2">
            <p
              className={cn(
                variant === 'secondary' ? 'text-p3s' : 'font-semibold',
                iconName
                  ? 'text-light-grey transition-colors group-hover:text-white'
                  : 'text-white',
                isActive && 'text-white',
              )}
            >
              {label}
            </p>

            {!!tagLabel && <Tag>{tagLabel}</Tag>}
          </div>

          {!!description && (
            <p className={cn('text-light-grey', variant === 'secondary' ? 'text-b2r' : 'text-xs')}>
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
