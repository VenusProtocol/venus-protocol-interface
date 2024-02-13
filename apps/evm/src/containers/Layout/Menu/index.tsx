import { useState } from 'react';

import venusLogoSrc from 'assets/img/venusLogo.svg';
import venusLogoWithTextSrc from 'assets/img/venusLogoWithText.svg';
import { Icon } from 'components';
import { PAGE_CONTAINER_ID } from 'constants/layout';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

import { ChainSelect } from '../ChainSelect';
import ClaimRewardButton from '../ClaimRewardButton';
import ConnectButton from '../ConnectButton';
import useGetMenuItems from '../useGetMenuItems';
import { NavLink } from './NavLink';

export const Menu: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState<boolean>(false);
  const isChainSelectEnabled = useIsFeatureEnabled({ name: 'chainSelect' });

  const toggleMobileMenu = () => {
    // Toggle scroll on page container and body tags
    const pageContainerDom = document.getElementById(PAGE_CONTAINER_ID);
    pageContainerDom?.classList.toggle('overflow-hidden');
    document.body.classList.toggle('overflow-hidden');

    setIsMobileMenuOpened(currentIsMobileMenuOpened => !currentIsMobileMenuOpened);
  };

  const menuItems = useGetMenuItems();

  return (
    <>
      {/* XS to MD menu */}
      <div className="md:hidden">
        <header className="flex h-14 items-center pr-4 md:h-auto">
          <Link
            className="mr-5 flex h-full flex-none items-center justify-center pl-4"
            to={routes.dashboard.path}
          >
            <img src={venusLogoSrc} alt={t('layout.menu.venusLogoAlt')} className="h-7" />
          </Link>

          <div className="flex flex-1 items-center justify-center">
            {isChainSelectEnabled && <ChainSelect className="mr-4" buttonClassName="h-9" />}

            <ConnectButton className="h-9 max-w-xs flex-1 px-1" />
          </div>

          <button
            onClick={toggleMobileMenu}
            type="button"
            className="bg-cards hover:bg-lightGrey active:bg-lightGrey ml-5 flex h-9 w-9 flex-none items-center justify-center rounded-lg p-0"
          >
            <Icon
              name={isMobileMenuOpened ? 'closeRounded' : 'burger'}
              className={cn('text-offWhite h-auto', isMobileMenuOpened ? 'w-[14px]' : 'w-[18px]')}
            />
          </button>
        </header>

        <div
          className={cn(
            'bg-background fixed bottom-0 left-0 right-0 top-14 z-50 overflow-y-auto pb-8 pt-4',
            isMobileMenuOpened ? 'block' : 'hidden',
          )}
        >
          <div className="mb-6">
            {menuItems.map(menuItem => (
              <NavLink onClick={toggleMobileMenu} key={menuItem.i18nKey} {...menuItem} />
            ))}
          </div>

          <div className="px-4">
            <ClaimRewardButton className="w-full" />
          </div>
        </div>
      </div>

      {/* MD and up menu */}
      <div className="bg-cards hidden pt-7 md:flex md:flex-col md:items-center xl:w-56">
        <Link
          className="mb-4 flex w-full items-center justify-center py-2"
          to={routes.dashboard.path}
        >
          <img src={venusLogoSrc} alt={t('layout.menu.venusLogoAlt')} className="h-9 xl:hidden" />

          <img
            src={venusLogoWithTextSrc}
            alt={t('layout.menu.venusLogoAlt')}
            className="hidden h-9 xl:block"
          />
        </Link>

        <div className="flex-1 overflow-auto px-3 py-6 xl:w-full xl:px-0">
          {menuItems.map(menuItem => (
            <NavLink onClick={toggleMobileMenu} key={menuItem.i18nKey} {...menuItem} />
          ))}
        </div>
      </div>
    </>
  );
};
