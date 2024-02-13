import { NavLink as RRNavLink, NavLinkProps as RRNavLinkProps } from 'react-router-dom';

import { Icon } from 'components';
import { useFormatTo } from 'hooks/useFormatTo';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

import { MenuItem } from '../../types';

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
          'hover:bg-lightGrey active:bg-lightGrey flex items-center justify-center whitespace-nowrap px-6 py-4 md:h-14 md:w-14 md:rounded-2xl md:p-0 xl:relative xl:h-auto xl:w-full xl:rounded-none xl:px-8 xl:py-4 xl:font-semibold',
          isActive
            ? 'text-blue md:bg-lightGrey md:text-offWhite xl:before:bg-blue xl:before:absolute xl:before:bottom-0 xl:before:left-0 xl:before:top-0 xl:before:w-1 xl:before:rounded-br-lg xl:before:rounded-tr-lg'
            : 'text-grey',
          className,
        )
      }
      to={formatTo({ to })}
      {...otherProps}
    >
      <Icon name={iconName} className="mr-4 h-6 w-6 text-inherit md:mr-0 xl:mr-4" />

      <div className="flex grow items-center md:hidden xl:flex">
        <p className="text-offWhite overflow-hidden text-ellipsis xl:text-inherit">{t(i18nKey)}</p>

        {isNew && (
          <div className="border-green bg-green/10 ml-3 inline-flex rounded-[4px] border px-[4px] py-[2px]">
            <span className="text-green mt-[1px] text-xs leading-[15px]">
              {t('layout.menu.navLink.new')}
            </span>
          </div>
        )}
      </div>

      <Icon name="chevronRight" className="text-offWhite ml-4 h-6 w-6 md:hidden" />
    </RRNavLink>
  );
};
