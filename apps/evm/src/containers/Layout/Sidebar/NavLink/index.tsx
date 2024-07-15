import { NavLink as RRNavLink, type NavLinkProps as RRNavLinkProps } from 'react-router-dom';

import { Icon } from 'components';
import { useFormatTo } from 'hooks/useFormatTo';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

import type { MenuItem } from 'containers/Layout/types';

export type NavLinkProps = MenuItem & Partial<RRNavLinkProps>;

export const NavLink: React.FC<NavLinkProps> = ({
  iconName,
  i18nKey,
  className,
  to,
  isNew = false,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const { formatTo } = useFormatTo();

  return (
    <RRNavLink
      className={({ isActive }) =>
        cn(
          'hover:bg-lightGrey active:bg-lightGrey flex items-center justify-center whitespace-nowrap px-6 py-4 h-14 w-14 rounded-xl p-0 xl:relative xl:h-auto xl:w-full xl:rounded-none xl:px-8 xl:py-4 xl:font-semibold',
          isActive
            ? 'bg-lightGrey text-offWhite xl:before:bg-blue xl:before:absolute xl:before:bottom-0 xl:before:left-0 xl:before:top-0 xl:before:w-1 xl:before:rounded-br-lg xl:before:rounded-tr-lg'
            : 'text-grey',
          className,
        )
      }
      to={formatTo({ to })}
      {...otherProps}
    >
      <Icon name={iconName} className="h-6 w-6 text-inherit xl:mr-4" />

      <div className="grow items-center hidden xl:flex">
        <p className="text-offWhite overflow-hidden text-ellipsis xl:text-inherit">{t(i18nKey)}</p>

        {isNew && (
          <div className="border-green bg-green/10 ml-3 inline-flex rounded-[4px] border px-[4px] py-[2px]">
            <span className="text-green mt-[1px] text-xs leading-[15px]">
              {t('layout.menu.navLink.new')}
            </span>
          </div>
        )}
      </div>
    </RRNavLink>
  );
};
