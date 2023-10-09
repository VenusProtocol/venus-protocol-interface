import { Icon } from 'components';
import { NavLink as RRNavLink, NavLinkProps as RRNavLinkProps } from 'react-router-dom';
import { useTranslation } from 'translation';
import { cn } from 'utilities';

import { MenuItem } from '../../types';

export type NavLinkProps = MenuItem & Partial<RRNavLinkProps>;

export const NavLink: React.FC<NavLinkProps> = ({
  iconName,
  i18nKey,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <RRNavLink
      className={({ isActive }) =>
        cn(
          'flex items-center px-6 py-4 hover:bg-lightGrey active:bg-lightGrey',
          isActive ? 'text-blue' : 'text-grey',
          className,
        )
      }
      {...otherProps}
    >
      <Icon name={iconName} className="mr-4 h-6 w-6 text-inherit" />

      <p className="mr-4 flex-1 overflow-hidden text-ellipsis text-offWhite">{t(i18nKey)}</p>

      <Icon name="chevronRight" className="h-6 w-6 text-offWhite" />
    </RRNavLink>
  );
};
