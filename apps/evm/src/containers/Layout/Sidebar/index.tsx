import { useTranslation } from 'react-i18next';

import { ChainId } from '@venusprotocol/chains';
import { VenusLogo, useBreakpointUp } from '@venusprotocol/ui';
import { routes } from 'constants/routing';
import useGetMenuItems from 'containers/Layout/useGetMenuItems';
import { Link } from 'containers/Link';
import { useChainId } from 'libs/wallet';
import { BerachainAd } from './BerachainAd';
import { NavLink } from './NavLink';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const menuItems = useGetMenuItems();
  const { chainId } = useChainId();

  // We prevent rendering the Berachain ad on mobile rather than simply hiding it using CSS to
  // prevent loading Lottie on those devices
  const isXlUp = useBreakpointUp('xl');

  return (
    <div className="bg-cards hidden pt-7 md:flex md:flex-col md:items-center xl:w-56">
      <Link
        className="mb-4 flex w-full items-center justify-center py-2"
        to={routes.dashboard.path}
      >
        <VenusLogo
          chainId={chainId}
          alt={t('layout.menu.venusLogoAlt')}
          className="h-9 xl:hidden"
        />

        <VenusLogo
          chainId={chainId}
          withText
          alt={t('layout.menu.venusLogoAlt')}
          className="hidden h-9 xl:block"
        />
      </Link>

      <div className="flex-1 overflow-auto px-3 py-6 xl:w-full xl:px-0">
        {menuItems.map(menuItem => (
          <NavLink key={menuItem.i18nKey} {...menuItem} />
        ))}
      </div>

      {isXlUp && chainId !== ChainId.BERACHAIN_MAINNET && chainId !== ChainId.BERACHAIN_TESTNET && (
        <BerachainAd />
      )}
    </div>
  );
};
