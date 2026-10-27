import { GatedAssetAcknowledgementModal } from 'containers/GatedAssetAcknowledgementModal';
import { LiquidityHubForm } from 'containers/LiquidityHubForm';
import { MarketForm as CoreMarketForm } from 'containers/MarketForm';
import { SpokeForm } from 'containers/SpokeForm';
import { useChain } from 'hooks/useChain';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import type { LiteBorrowMarket, LiteEarnMarket } from '../../types';

export interface MarketFormProps {
  market: LiteEarnMarket | LiteBorrowMarket;
  mode: 'earn' | 'borrow';
  onClose: () => void;
}

export const MarketForm: React.FC<MarketFormProps> = ({ market, mode, onClose }) => {
  const { corePoolComptrollerContractAddress } = useChain();
  const [userChainSettings] = useUserChainSettings();
  const { source } = market;

  if (source.type === 'hub') {
    return (
      <LiquidityHubForm
        vhToken={source.hub.vhToken}
        initialActiveTabId="supply"
        onSubmitSuccess={onClose}
      />
    );
  }

  if (source.type === 'spoke') {
    return (
      <SpokeForm
        spokePool={source.pool}
        asset={source.asset}
        initialActiveTabId="loan"
        initialLoanTabId="borrow"
        navType="state"
        onSubmitSuccess={onClose}
      />
    );
  }

  if (source.asset.isGated && !userChainSettings.doNotShowGatedAssetModal) {
    return <GatedAssetAcknowledgementModal onReject={onClose} />;
  }

  return (
    <CoreMarketForm
      vToken={source.asset.vToken}
      poolComptrollerAddress={corePoolComptrollerContractAddress}
      initialActiveTabId={mode === 'earn' ? 'supply' : 'borrow'}
      visibleTabIds={mode === 'earn' ? ['supply', 'withdraw'] : ['borrow', 'repay']}
      navType="state"
      onSubmitSuccess={onClose}
    />
  );
};
