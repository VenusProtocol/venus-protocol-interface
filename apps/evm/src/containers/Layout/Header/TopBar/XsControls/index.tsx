import { useState } from 'react';

import { cn } from '@venusprotocol/ui';
import venusLogoSrc from 'assets/img/venusLogo.svg';
import { Icon } from 'components';
import { PAGE_CONTAINER_ID } from 'constants/layout';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { routes } from 'constants/routing';
import { BurnedWBnbButton } from 'containers/Layout/BurnedWBnbButton';
import ClaimRewardButton from 'containers/Layout/ClaimRewardButton';
import { ConnectButton } from 'containers/Layout/ConnectButton';
import useGetMenuItems from 'containers/Layout/useGetMenuItems';
import { useIsOnMarketPage } from '../../useIsOnMarketPage';
import { ChainSelect } from '../ChainSelect';
import { NavLink } from './NavLink';

export const XsControls: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState<boolean>(false);
  const menuItems = useGetMenuItems();

  const isOnMarketPage = useIsOnMarketPage();

  const toggleMobileMenu = () => {
    // Toggle scroll on page container and body tags
    const pageContainerDom = document.getElementById(PAGE_CONTAINER_ID);
    pageContainerDom?.classList.toggle('overflow-hidden');
    document.body.classList.toggle('overflow-hidden');

    setIsMobileMenuOpened(currentIsMobileMenuOpened => !currentIsMobileMenuOpened);
  };

  return (
    <div className={cn('md:hidden', isMobileMenuOpened && 'bg-background')}>
      <div className="flex h-14 items-center pr-4 md:h-auto relative">
        <Link
          className="mr-5 flex h-full flex-none items-center justify-center pl-4"
          to={routes.landing.path}
        >
          <img src={venusLogoSrc} alt={t('layout.menu.venusLogoAlt')} className="h-7" />
        </Link>

        <div className="flex flex-1 items-center justify-center gap-4">
          <ChainSelect
            variant={isOnMarketPage && !isMobileMenuOpened ? 'tertiary' : 'primary'}
            buttonClassName={cn(
              'h-9',
              isOnMarketPage && 'bg-background/40 hover:bg-background/40 active:bg-background/40',
            )}
          />

          <ConnectButton
            className="h-9 max-w-xs flex-1 px-1"
            variant={isOnMarketPage && !isMobileMenuOpened ? 'secondary' : 'primary'}
          />
        </div>

        <button
          onClick={toggleMobileMenu}
          type="button"
          className={cn(
            'hover:bg-lightGrey active:bg-lightGrey ml-5 flex h-9 w-9 flex-none items-center justify-center rounded-lg p-0 border-lightGrey cursor-pointer',
            !isOnMarketPage && 'border bg-cards',
            isOnMarketPage && 'bg-background/40 hover:bg-background/40 active:bg-background/40',
          )}
        >
          <Icon
            name={isMobileMenuOpened ? 'closeRounded' : 'burger'}
            className={cn('text-offWhite h-auto', isMobileMenuOpened ? 'w-[14px]' : 'w-[18px]')}
          />
        </button>
      </div>

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

        <div className="px-6 space-y-6">
          <ClaimRewardButton className="w-full" />

          <BurnedWBnbButton className="w-full" />
        </div>
      </div>
    </div>
  );
};
