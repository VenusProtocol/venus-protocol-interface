// import ClaimRewardButton from '../ClaimRewardButton';
import { Icon } from 'components';
import { useState } from 'react';
import { useTranslation } from 'translation';
import { cn } from 'utilities';

import venusLogoSrc from 'assets/img/venusLogo.svg';
import { PAGE_CONTAINER_ID } from 'constants/layout';

import ClaimRewardButton from '../ClaimRewardButton';
import ConnectButton from '../ConnectButton';
import useGetMenuItems from '../useGetMenuItems';
import { NavLink } from './NavLink';

export const Menu: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState<boolean>(false);

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
      <header className="flex h-14 items-center px-4 md:h-auto">
        <img src={venusLogoSrc} alt={t('layout.menu.venusLogoAlt')} className="mr-8 w-9" />

        <ConnectButton className="h-9 w-full" />

        <button
          onClick={toggleMobileMenu}
          type="button"
          className="ml-8 flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-cards p-0 hover:bg-lightGrey active:bg-lightGrey"
        >
          <Icon
            name={isMobileMenuOpened ? 'closeRounded' : 'burger'}
            className={cn('h-auto text-offWhite', isMobileMenuOpened ? 'w-[14px]' : 'w-[18px]')}
          />
        </button>
      </header>

      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 top-14 z-50 overflow-y-auto bg-background pb-8 pt-4',
          isMobileMenuOpened ? 'block' : 'hidden',
        )}
      >
        {menuItems.map(menuItem => (
          <NavLink onClick={toggleMobileMenu} className="last-of-type:mb-6" {...menuItem} />
        ))}

        <div className="px-4">
          <ClaimRewardButton className="w-full" />
        </div>
      </div>
    </>
  );
};
