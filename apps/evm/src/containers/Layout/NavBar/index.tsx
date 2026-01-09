import { Button, cn } from '@venusprotocol/ui';

import venusLogoSrc from 'assets/img/venusLogo.svg';
import { Icon } from 'components';
import { PAGE_CONTAINER_ID } from 'constants/layout';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { ChainSelect } from './ChainSelect';
import { ConnectButton } from './ConnectButton';
import { MobileMenuItem } from './MobileMenuItem';
import { useMenuItems } from './useMenuItems';

export type NavBarProps = React.HTMLAttributes<HTMLDivElement>;

export const NavBar: React.FC<NavBarProps> = ({ className, ...containerProps }) => {
  const { t } = useTranslation();
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    // Toggle scroll on page container and body tags
    const pageContainerDom = document.getElementById(PAGE_CONTAINER_ID);
    pageContainerDom?.classList.toggle('overflow-hidden');
    document.body.classList.toggle('overflow-hidden');

    setIsMobileMenuOpened(currentIsMobileMenuOpened => !currentIsMobileMenuOpened);
  };

  const menuItems = useMenuItems();

  return (
    <nav className="relative">
      <div
        className={cn(
          'bg-background-active h-20 pr-5 flex items-center justify-between',
          className,
        )}
        {...containerProps}
      >
        <Link
          className="flex h-full flex-none items-center justify-center px-5"
          to={routes.landing.path}
        >
          <img src={venusLogoSrc} alt={t('layout.menu.venusLogoAlt')} className="w-9" />
        </Link>

        <div className="flex items-center gap-x-2">
          <ChainSelect buttonClassName="h-9 px-3 py-0 border-dark-blue" />

          <ConnectButton className="h-9 max-w-xs flex-1 px-3" />

          <Button
            className="bg-dark-blue h-9 w-9 p-0 border-dark-blue-disabled/50 hover:bg-dark-blue-hover active:bg-dark-blue-hover"
            onClick={toggleMobileMenu}
          >
            <Icon
              name={isMobileMenuOpened ? 'closeRounded' : 'burger'}
              className={cn(isMobileMenuOpened ? 'text-light-grey size-3' : 'text-white')}
            />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'top-20 bottom-0 left-0 right-0 z-50 p-5 bg-[#000000] overflow-y-auto',
          isMobileMenuOpened ? 'fixed' : 'hidden',
        )}
      >
        <p className="mb-5">{t('layout.menu.label')}</p>

        {menuItems.map(item => (
          <MobileMenuItem key={item.label} item={item} onClick={toggleMobileMenu} />
        ))}
      </div>
    </nav>
  );
};
