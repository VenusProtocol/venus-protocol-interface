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
          'text-secondary size-6 transition-colors group-hover:text-primary',
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
        'block rounded-lg group transition-colors hover:no-underline',
        variant === 'secondary'
          ? 'p-2 hover:bg-hover-subtle focus-visible:bg-hover-subtle'
          : 'py-3 px-4 bg-surface-1 hover:bg-hover',
        isActive && (variant === 'secondary' ? 'bg-selected-subtle' : 'bg-selected'),
      )}
    >
      <div className="flex gap-x-3">
        {(iconName || imgSrc || menuIconName) && (
          <div
            className={cn(
              'rounded-lg shrink-0 flex items-center justify-center',
              variant === 'secondary' ? 'size-10' : 'size-12',
              !!iconName && 'bg-surface-3',
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
