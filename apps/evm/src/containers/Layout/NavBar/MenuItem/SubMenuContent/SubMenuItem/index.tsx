import { cn } from '@venusprotocol/ui';

import { Icon } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { matchPath, useLocation } from 'react-router';
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
  onClick,
  variant,
}) => {
  const { t } = useTranslation();

  const { pathname } = useLocation();

  const isActive = to && !!matchPath(to, pathname);

  const linkNavProps = to ? { to } : { href };

  return (
    <Link
      {...linkNavProps}
      onClick={onClick}
      className={cn(
        'block py-3 space-y-6 rounded-lg group transition-colors whitespace-nowrap hover:no-underline',
        variant === 'secondary' ? 'px-6' : 'px-4 bg-background-active hover:bg-background-hover',
        isActive && variant === 'primary' && 'bg-background-hover',
      )}
    >
      <div className="flex gap-x-3">
        {(iconName || imgSrc) && (
          <div
            className={cn(
              'rounded-lg size-12 flex items-center justify-center',
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
              <img src={imgSrc} alt={label} />
            )}
          </div>
        )}

        <div className="flex flex-col justify-between">
          <p
            className={cn(
              'font-semibold',
              iconName ? 'text-light-grey transition-colors group-hover:text-white' : 'text-white',
              isActive && 'text-white',
            )}
          >
            {label}
          </p>

          {!!description && <p className="text-light-grey text-xs">{description}</p>}
        </div>
      </div>

      {variant === 'secondary' && (
        <div
          className={cn(
            'rounded-lg border border-dark-blue-active text-white inline-block px-3 py-2 transition-colors group-hover:bg-dark-blue-active',
            isActive && 'bg-dark-blue-active',
          )}
        >
          {t('layout.menu.subMenuItem.button.label')}
        </div>
      )}
    </Link>
  );
};
