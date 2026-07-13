import { cn } from '@venusprotocol/ui';

import venusLogoSrc from 'assets/img/venusLogo.svg';
import venusLogoWithTextSrc from 'assets/img/venusLogoWithText.svg';
import { Delimiter, Icon } from 'components';
import { PAGE_CONTAINER_ID } from 'constants/layout';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useEffect } from 'react';
import { useStore } from '../store';
import { ChainSelect } from './ChainSelect';
import { ClaimRewardsButton } from './ClaimRewardsButton';
import { ConnectButton } from './ConnectButton';
import { MenuItem } from './MenuItem';
import { NavButtonWrapper } from './NavButtonWrapper';
import { Settings } from './Settings';
import { SettingsButton } from './SettingsButton';
import { useMenuItems } from './useMenuItems';

export type NavBarProps = React.HTMLAttributes<HTMLDivElement>;

export const NavBar: React.FC<NavBarProps> = ({ className, ...containerProps }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const openModal = useStore(state => state.openModal);
  const isMobileMenuOpen = openModal === 'mobileMenu';

  const isUserConnected = !!accountAddress;

  const closeMobileMenu = () => {
    useStore.setState({ openModal: undefined });
  };

  const toggleMobileMenu = () => {
    useStore.setState({
      openModal: isMobileMenuOpen ? undefined : 'mobileMenu',
    });
  };

  useEffect(() => {
    const pageContainerDom = document.getElementById(PAGE_CONTAINER_ID);

    if (isMobileMenuOpen) {
      pageContainerDom?.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');
    } else {
      pageContainerDom?.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      pageContainerDom?.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);

  const menuItems = useMenuItems();

  return (
    <nav className="relative">
      <div
        className={cn(
          'group/navbar bg-background-active h-20 pr-5 flex items-center justify-between',
          className,
        )}
        {...containerProps}
      >
        <div className="flex items-center xl:gap-x-1">
          <Link
            className="flex h-full flex-none items-center justify-center px-5 py-6"
            to={routes.landing.path}
            onClick={closeMobileMenu}
          >
            <img src={venusLogoSrc} alt={t('layout.menu.venusLogoAlt')} className="h-8 sm:hidden" />

            <img
              src={venusLogoWithTextSrc}
              alt={t('layout.menu.venusLogoAlt')}
              className="h-8 hidden sm:block"
            />
          </Link>

          {/* LG and up menu */}
          <div className="hidden items-center lg:flex xl:gap-x-3">
            {menuItems.map(item => (
              <MenuItem key={item.label} item={item} onClick={closeMobileMenu} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-x-3 h-9 sm:h-12">
          <ClaimRewardsButton className="h-full hidden sm:flex" data-rewards-button="true" />

          <ChainSelect buttonClassName="h-10 px-3 py-0 bg-dark-blue border-dark-blue-disabled/50 hover:bg-dark-blue-hover hover:border-dark-blue-disabled/50 hover:no-underline active:bg-dark-blue-hover sm:h-12" />

          <ConnectButton />

          <NavButtonWrapper
            className="size-10 px-0 sm:size-12 lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Icon
              name={isMobileMenuOpen ? 'closeRounded' : 'burger'}
              className={cn(isMobileMenuOpen ? 'text-light-grey size-3' : 'text-white')}
            />
          </NavButtonWrapper>

          {!isUserConnected && <SettingsButton className="h-full px-0 hidden lg:flex" />}
        </div>
      </div>

      {/* Mobile/tablet menu */}
      <div
        className={cn(
          isMobileMenuOpen ? 'fixed' : 'hidden',
          'top-20 bottom-0 left-0 right-0 z-40 p-5 bg-[#000000] overflow-y-auto lg:hidden',
        )}
      >
        <div className="flex items-center justify-between mb-5">
          <p>{t('layout.menu.label')}</p>
        </div>

        <div className="mb-2">
          {menuItems.map(item => (
            <MenuItem key={item.label} item={item} onClick={closeMobileMenu} />
          ))}
        </div>

        <Delimiter className="mb-6" />

        <Settings />
      </div>
    </nav>
  );
};
