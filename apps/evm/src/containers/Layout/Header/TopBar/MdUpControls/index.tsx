import { cn } from '@venusprotocol/ui';
import ClaimRewardButton from 'containers/Layout/ClaimRewardButton';
import { ConnectButton } from 'containers/Layout/ConnectButton';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useIsOnMarketPage } from '../../useIsOnMarketPage';
import { ChainSelect } from '../ChainSelect';
import { GaslessStatus } from '../GaslessStatus';
import { SwapButton } from './SwapButton';

export const MdUpControls: React.FC = () => {
  const isOnMarketPage = useIsOnMarketPage();
  const [userChainSettings] = useUserChainSettings();

  return (
    <div className="hidden md:flex md:h-12 md:items-center md:space-x-4 md:pl-6">
      <SwapButton />

      <ClaimRewardButton
        variant={isOnMarketPage ? 'secondary' : 'primary'}
        className="flex-none md:whitespace-nowrap"
      />

      <GaslessStatus
        wrapWithTooltip
        displayLabel
        className={cn('transition-opacity', !userChainSettings.gaslessTransactions && 'opacity-50')}
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
