import { cn } from 'utilities';
import { MarketInfo } from './MarketInfo';
import { TopBar } from './TopBar';
import { useNewMarketFeature } from './useNewMarketFeature';

export const Header: React.FC = () => {
  const shouldUseNewMarketFeature = useNewMarketFeature();

  return (
    <header
      // TODO: get accent color dynamically for each asset (see VEN-2545)
      className={cn(
        'transition-all duration-500',
        shouldUseNewMarketFeature && 'bg-gradient-to-b from-[rgba(42,90,218,0.30)] to-transparent',
      )}
    >
      <TopBar />

      {shouldUseNewMarketFeature && <MarketInfo />}
    </header>
  );
};
