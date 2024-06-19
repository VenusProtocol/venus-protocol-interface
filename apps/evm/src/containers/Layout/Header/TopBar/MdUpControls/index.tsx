import ClaimRewardButton from 'containers/Layout/ClaimRewardButton';
import { ConnectButton } from 'containers/Layout/ConnectButton';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { cn } from 'utilities';
import { useIsOnMarketPage } from '../../useIsOnMarketPage';
import { ChainSelect } from '../ChainSelect';

export const MdUpControls: React.FC = () => {
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });
  const isOnMarketPage = useIsOnMarketPage();
  const shouldUseNewMarketPageFeature = isNewMarketPageEnabled && isOnMarketPage;

  return (
    <div className="hidden md:flex md:h-12 md:items-center md:space-x-4 md:pl-6">
      <ClaimRewardButton
        variant={shouldUseNewMarketPageFeature ? 'secondary' : 'primary'}
        className="flex-none md:whitespace-nowrap"
      />

      <ChainSelect
        variant={shouldUseNewMarketPageFeature ? 'tertiary' : 'primary'}
        buttonClassName={cn(
          shouldUseNewMarketPageFeature &&
            'bg-background/40 hover:bg-background/40 active:bg-background/40',
        )}
      />

      <ConnectButton
        className="flex-none"
        variant={shouldUseNewMarketPageFeature ? 'secondary' : 'primary'}
      />
    </div>
  );
};
