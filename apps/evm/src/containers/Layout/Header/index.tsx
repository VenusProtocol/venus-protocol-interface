import { routes } from 'constants/routing';
import { cn } from 'utilities';
import { MarketInfo } from './MarketInfo';
import { TopBar } from './TopBar';
import { useGetCurrentRoutePath } from 'hooks/useGetCurrentRoutePath';

export const Header: React.FC = () => {
  const currentRoutePath = useGetCurrentRoutePath();
  const isOnMarketPage =
    currentRoutePath === routes.corePoolMarket.path ||
    currentRoutePath === routes.lidoPoolMarket.path ||
    currentRoutePath === routes.isolatedPoolMarket.path;

  return (
    <header
      // TODO: get accent color dynamically for each asset
      // TODO: animate gradient on mount
      className={cn(
        'transition-all duration-500',
        isOnMarketPage && 'bg-gradient-to-b from-[rgba(42,90,218,0.30)] to-transparent',
      )}
    >
      <TopBar />

      {isOnMarketPage && <MarketInfo />}
    </header>
  );
};
