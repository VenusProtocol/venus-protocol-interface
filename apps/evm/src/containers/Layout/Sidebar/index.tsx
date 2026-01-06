import { useTranslation } from 'react-i18next';

import venusLogoSrc from 'assets/img/venusLogo.svg';
import venusLogoWithTextSrc from 'assets/img/venusLogoWithText.svg';
import { routes } from 'constants/routing';
import useGetMenuItems from 'containers/Layout/useGetMenuItems';
import { Link } from 'containers/Link';
import { NavLink } from './NavLink';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const menuItems = useGetMenuItems();

  return (
    <div className="bg-cards hidden pt-7 md:flex md:flex-col md:items-center xl:w-56">
      <Link className="mb-4 flex w-full items-center justify-center py-2" to={routes.landing.path}>
        <img src={venusLogoSrc} alt={t('layout.menu.venusLogoAlt')} className="h-9 xl:hidden" />

        <img
          src={venusLogoWithTextSrc}
          alt={t('layout.menu.venusLogoAlt')}
          className="hidden h-9 xl:block"
        />
      </Link>

      <div className="flex-1 overflow-auto px-3 py-6 xl:w-full xl:px-0">
        {menuItems.map(menuItem => (
          <NavLink key={menuItem.i18nKey} {...menuItem} />
        ))}
      </div>
    </div>
  );
};
