import { useGetPrimeToken } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';

import { PrimePromotionalBanner } from './PrimePromotionalBanner';
import { store } from './store';

export const Banner: React.FC = () => {
  const { accountAddress } = useAccountAddress();

  const { data: getPrimeTokenData } = useGetPrimeToken({
    accountAddress,
  });
  const isAccountPrime = !!getPrimeTokenData?.exists;

  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const storeShouldShowPrimePromotionalBanner = store.use.shouldShowBanner();
  const hidePrimePromotionalBanner = store.use.hideBanner();

  const canShowPrimePromotionalBanner = isPrimeEnabled && storeShouldShowPrimePromotionalBanner;

  if (canShowPrimePromotionalBanner && (!isAccountPrime || !accountAddress)) {
    return <PrimePromotionalBanner onHide={hidePrimePromotionalBanner} />;
  }

  return null;
};
