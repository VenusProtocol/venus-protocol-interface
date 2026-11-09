import { cn } from '@venusprotocol/ui';

import venusLogoSrc from 'assets/img/venusLogo.svg';
import venusLogoWithTextSrc from 'assets/img/venusLogoWithText.svg';
import { Delimiter, Icon } from 'components';
import { PAGE_CONTAINER_ID } from 'constants/layout';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useProHomePath } from 'hooks/useProHomePath';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useEffect } from 'react';
import { useStore } from '../store';
import TEST_IDS from '../testIds';
import { ChainBadge } from './ChainBadge';
import { ChainSelect } from './ChainSelect';
import { ClaimRewardsButton } from './ClaimRewardsButton';
import { ConnectButton } from './ConnectButton';
import { InterfaceModeLabel } from './InterfaceModeLabel';
import { InterfaceModeSwitch } from './InterfaceModeSwitch';
import { MenuItem } from './MenuItem';
import { NavButtonWrapper } from './NavButtonWrapper';
import { Settings } from './Settings';
import { SettingsButton } from './SettingsButton';
import { useMenuItems } from './useMenuItems';

export type NavBarProps = React.HTMLAttributes<HTMLDivElement>;

export const NavBar: React.FC<NavBarProps> = ({ className, ...containerProps }) => {
  const { t } = useTranslation();
  const { isLite } = useInterfaceMode();
  const proHomePath = useProHomePath();
  const isLiteModeEnabled = useIsFeatureEnabled({ name: 'liteMode' });
  const openModal = useStore(state => state.openModal);
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;
  const isMobileMenuOpen = openModal === 'mobileMenu';

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
          'group/navbar bg-background-active h-16 pr-2 flex items-center justify-between sm:pr-5',
          className,
        )}
        {...containerProps}
      >
        <div className="flex items-center gap-x-0">
          <Link
            className="flex h-full flex-none items-center justify-center py-4 pl-2 pr-0 sm:pl-5"
            to={isLite ? routes.landing.path : proHomePath}
            onClick={closeMobileMenu}
          >
            <img src={venusLogoSrc} alt={t('layout.menu.venusLogoAlt')} className="h-8 sm:hidden" />

            <img
              src={venusLogoWithTextSrc}
              alt={t('layout.menu.venusLogoAlt')}
              className="h-8 hidden sm:block"
            />
          </Link>

          <InterfaceModeLabel className="ml-2 max-xs:hidden" />

          {/* LG and up menu */}
          {!isLite && (
            <div
              className="ml-4 hidden items-center lg:flex xl:gap-x-3"
              data-testid={TEST_IDS.navBarMenu}
            >
              {menuItems.map(item => (
                <MenuItem key={item.label} item={item} onClick={closeMobileMenu} />
              ))}
            </div>
          )}
        </div>

        <div
          className="flex items-center gap-x-1 h-9 sm:h-12 sm:gap-x-3"
          data-testid={TEST_IDS.navBarActions}
        >
          <ClaimRewardsButton className="h-full max-sm:px-2" data-rewards-button="true" />

          {!isLite && (
            <ChainSelect className="hidden md:block" buttonClassName="h-10 px-3 py-0 sm:h-12" />
          )}

          {isLite && <ChainBadge />}

          <ConnectButton />

          {isLiteModeEnabled && <InterfaceModeSwitch onSwitch={closeMobileMenu} />}

          {!isLite && (
            <NavButtonWrapper
              className="size-9 px-0 sm:size-12 lg:hidden"
              onClick={toggleMobileMenu}
            >
              <Icon
                name={isMobileMenuOpen ? 'close' : 'burger'}
                className={cn(isMobileMenuOpen ? 'text-light-grey size-5' : 'text-white w-4.5 h-3')}
              />
            </NavButtonWrapper>
          )}

          {!isUserConnected && (
            <SettingsButton className={cn('h-full px-0 lg:flex', !isLite && 'hidden')} />
          )}
        </div>
      </div>

      {/* Mobile/tablet menu */}
      <div
        className={cn(
          !isLite && isMobileMenuOpen ? 'fixed' : 'hidden',
          'top-16 bottom-0 left-0 right-0 z-40 p-5 bg-background-active bg-linear-to-b from-background/50 to-background/50 overflow-y-auto lg:hidden',
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

        {!isUserConnected && (
          <>
            {isMobileMenuOpen && (
              <div className="mb-6 md:hidden">
                <p className="mb-2 text-sm text-light-grey">{t('layout.chainSelect.label')}</p>

                <ChainSelect buttonClassName="h-12 px-3" />
              </div>
            )}

            <Delimiter className="mb-6" />

            <Settings />
          </>
        )}
      </div>
    </nav>
  );
};
