import { NavLink as RRNavLink, NavLinkProps as RRNavLinkProps } from 'react-router-dom';

import { Icon } from 'components';
import { useFormatTo } from 'hooks/useFormatTo';
import { useTranslation } from 'packages/translations';
import { cn } from 'utilities';

import { MenuItem } from '../../types';

export type NavLinkProps = MenuItem & Partial<RRNavLinkProps>;

export const NavLink: React.FC<NavLinkProps> = ({
  iconName,
  i18nKey,
  className,
  to,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const formatTo = useFormatTo();

  return (
    <RRNavLink
      className={({ isActive }) =>
        cn(
          'flex items-center justify-center whitespace-nowrap px-6 py-4 hover:bg-lightGrey active:bg-lightGrey md:h-14 md:w-14 md:rounded-2xl md:p-0 xl:relative xl:h-auto xl:w-full xl:rounded-none xl:px-8 xl:py-4 xl:font-semibold',
          isActive
            ? 'text-blue md:bg-lightGrey md:text-offWhite xl:before:absolute xl:before:bottom-0 xl:before:left-0 xl:before:top-0 xl:before:w-1 xl:before:rounded-br-lg xl:before:rounded-tr-lg xl:before:bg-blue'
            : 'text-grey',
          className,
        )
      }
      to={formatTo({ to })}
      {...otherProps}
    >
      <Icon name={iconName} className="mr-4 h-6 w-6 text-inherit md:mr-0 xl:mr-4" />

      <p className="mr-4 flex-1 overflow-hidden text-ellipsis text-offWhite md:hidden xl:mr-0 xl:block xl:text-inherit">
        {t(i18nKey)}
      </p>

      <Icon name="chevronRight" className="h-6 w-6 text-offWhite md:hidden" />
    </RRNavLink>
  );
};
