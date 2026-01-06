import { NavLink as RRNavLink, type NavLinkProps as RRNavLinkProps } from 'react-router';

import { cn } from '@venusprotocol/ui';
import { Icon } from 'components';
import type { MenuItem } from 'containers/Layout/types';
import { useFormatTo } from 'hooks/useFormatTo';
import { useTranslation } from 'libs/translations';

export type NavLinkProps = MenuItem & Partial<RRNavLinkProps>;

export const NavLink: React.FC<NavLinkProps> = ({
  iconName,
  i18nKey,
  className,
  to,
  isNew = false,
  badgeNumber,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const { formatTo } = useFormatTo();

  return (
    <RRNavLink
      className={({ isActive }) =>
        cn(
          'hover:bg-lightGrey active:bg-lightGrey flex items-center justify-center whitespace-nowrap px-6 py-4',
          isActive ? 'text-blue' : 'text-grey',
          className,
        )
      }
      to={formatTo({ to })}
      {...otherProps}
    >
      <Icon name={iconName} className="mr-4 h-6 w-6 text-inherit" />

      <div className="flex grow items-center">
        <p className="text-white overflow-hidden text-ellipsis xl:text-inherit">{t(i18nKey)}</p>

        {isNew && (
          <div className="border-green bg-green/10 ml-3 inline-flex rounded-[4px] border px-[4px] py-[2px]">
            <span className="text-green mt-[1px] text-xs leading-[15px]">
              {t('layout.menu.navLink.new')}
            </span>
          </div>
        )}
      </div>

      {badgeNumber && (
        <div className="shrink-0 w-5 h-5 rounded-md bg-lightGrey items-center justify-center flex">
          <span className="text-xs text-white">{badgeNumber}</span>
        </div>
      )}

      <Icon name="chevronRight" className="text-white ml-4 h-6 w-6" />
    </RRNavLink>
  );
};
