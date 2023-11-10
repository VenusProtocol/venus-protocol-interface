import { useGetPrimeToken } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { ConnectWalletBanner } from './ConnectWalletBanner';
import { PrimePromotionalBanner } from './PrimePromotionalBanner';
import { store } from './store';

export const Banner: React.FC = () => {
  const { accountAddress, openAuthModal } = useAuth();

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken({
    accountAddress,
  });
  const isAccountPrime = !!getPrimeTokenData?.exists;

  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const storeShouldShowPrimePromotionalBanner = store.use.shouldShowBanner();
  const hidePrimePromotionalBanner = store.use.hideBanner();

  const canShowPrimePromotionalBanner = isPrimeEnabled && storeShouldShowPrimePromotionalBanner;

  if (
    canShowPrimePromotionalBanner &&
    ((!isAccountPrime && !isGetPrimeTokenLoading) || !accountAddress)
  ) {
    return <PrimePromotionalBanner onHide={hidePrimePromotionalBanner} />;
  }

  if (!accountAddress && !isGetPrimeTokenLoading) {
    return <ConnectWalletBanner openAuthModal={openAuthModal} />;
  }

  return null;
};
