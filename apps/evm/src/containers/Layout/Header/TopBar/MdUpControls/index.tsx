import ClaimRewardButton from 'containers/Layout/ClaimRewardButton';
import { ConnectButton } from 'containers/Layout/ConnectButton';
import { cn } from 'utilities';
import { useIsOnMarketPage } from '../../useIsOnMarketPage';
import { ChainSelect } from '../ChainSelect';

export const MdUpControls: React.FC = () => {
  const isOnMarketPage = useIsOnMarketPage();

  return (
    <div className="hidden md:flex md:h-12 md:items-center md:space-x-4 md:pl-6">
      <ClaimRewardButton
        variant={isOnMarketPage ? 'secondary' : 'primary'}
        className="flex-none md:whitespace-nowrap"
      />

      <ChainSelect
        variant={isOnMarketPage ? 'tertiary' : 'primary'}
        buttonClassName={cn(
          isOnMarketPage && 'bg-background/40 hover:bg-background/40 active:bg-background/40',
        )}
      />

      <ConnectButton className="flex-none" variant={isOnMarketPage ? 'secondary' : 'primary'} />
    </div>
  );
};
