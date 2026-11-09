import { cn } from '@venusprotocol/ui';

import { Icon } from 'components';
import { Link } from 'containers/Link';
import { matchPath, useLocation } from 'react-router';
import { MenuIcon } from '../../../MenuIcon';
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
  menuIconName,
  tagLabel,
  onClick,
  variant,
}) => {
  const { pathname } = useLocation();

  const isActive = to && !!matchPath(to, pathname);

  const linkNavProps = to ? { to } : { href };

  let iconDom = (
    <img src={imgSrc} alt={label} className={variant === 'secondary' ? 'size-10' : 'size-12'} />
  );

  if (iconName) {
    iconDom = (
      <Icon
        name={iconName}
        className={cn(
          'text-secondary size-5 transition-colors group-hover:text-primary',
          isActive && 'text-primary',
        )}
      />
    );
  }

  if (menuIconName) {
    iconDom = (
      <MenuIcon
        name={menuIconName}
        aria-label={label}
        role="img"
        className={variant === 'secondary' ? 'size-10' : 'size-12'}
      />
    );
  }

  return (
    <Link
      {...linkNavProps}
      onClick={onClick}
      data-nav-item
      className={cn(
        'block rounded-lg group transition-[background-color,box-shadow] hover:no-underline hover:bg-surface-segment-hover hover:shadow-menu-item-hover focus-visible:bg-surface-segment-hover focus-visible:shadow-menu-item-hover',
        variant === 'secondary' ? 'p-2' : 'p-3',
      )}
    >
      <div className={cn('flex gap-x-3', !!iconName && 'items-center')}>
        {(iconName || imgSrc || menuIconName) && (
          <div
            className={cn(
              'rounded-lg shrink-0 flex items-center justify-center',
              iconName
                ? 'size-9 bg-surface-raised shadow-menu-icon transition-[background-color,box-shadow] group-hover:bg-blue/14 group-hover:shadow-menu-icon-hover group-focus-visible:bg-blue/14 group-focus-visible:shadow-menu-icon-hover'
                : variant === 'secondary'
                  ? 'size-10'
                  : 'size-12',
              !!menuIconName && menuIconName !== 'core' && 'nav-icon-glint',
            )}
          >
            {iconDom}
          </div>
        )}

        <div className={cn('flex flex-col', variant === 'secondary' && 'w-52 shrink-0')}>
          <div className="flex items-center gap-x-2">
            <p
              className={cn(
                variant === 'secondary' ? 'text-p3s' : 'font-semibold',
                iconName
                  ? 'text-secondary transition-colors group-hover:text-primary'
                  : 'text-primary',
                isActive && 'text-primary',
              )}
            >
              {label}
            </p>

            {!!tagLabel && <Tag>{tagLabel}</Tag>}
          </div>

          {!!description && (
            <p className={cn('text-secondary', variant === 'secondary' ? 'text-b2r' : 'text-xs')}>
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
