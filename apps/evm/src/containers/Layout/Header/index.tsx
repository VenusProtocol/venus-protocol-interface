import { routes } from 'constants/routing';
import { useGetCurrentRoutePath } from 'hooks/useGetCurrentRoutePath';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { cn } from 'utilities';
import { MarketInfo } from './MarketInfo';
import { TopBar } from './TopBar';

export const Header: React.FC = () => {
  const currentRoutePath = useGetCurrentRoutePath();

  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });
  const isOnMarketPage =
    currentRoutePath === routes.corePoolMarket.path ||
    currentRoutePath === routes.lidoPoolMarket.path ||
    currentRoutePath === routes.isolatedPoolMarket.path;

  return (
    <header
      // TODO: get accent color dynamically for each asset (see VEN-2545)
      className={cn(
        'transition-all duration-500',
        isNewMarketPageEnabled &&
          isOnMarketPage &&
          'bg-gradient-to-b from-[rgba(42,90,218,0.30)] to-transparent',
      )}
    >
      <TopBar />

      {isNewMarketPageEnabled && isOnMarketPage && <MarketInfo />}
    </header>
  );
};
