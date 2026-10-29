import { LiquidityHubFormModal } from 'containers/LiquidityHubFormModal';
import { MarketFormModal as CoreMarketFormModal } from 'containers/MarketFormModal';
import { SpokeFormModal } from 'containers/SpokeFormModal';
import { VenusVaultModal } from 'containers/VenusVaultModal';
import { useChain } from 'hooks/useChain';
import { useTranslation } from 'libs/translations';
import type { LiteBorrowMarket, LiteEarnMarket } from '../../types';
import { useMarketName } from '../../useMarketName';

export interface MarketFormModalProps {
  market: LiteEarnMarket | LiteBorrowMarket;
  mode: 'earn' | 'borrow';
  onClose: () => void;
}

export const MarketFormModal: React.FC<MarketFormModalProps> = ({ market, mode, onClose }) => {
  const { t } = useTranslation();
  const { corePoolComptrollerContractAddress } = useChain();
  const getMarketName = useMarketName();
  const { source } = market;

  let symbol = '';

  if (source.type === 'hub') {
    symbol = source.hub.vhToken.underlyingToken.symbol;
  } else if (source.type === 'vault') {
    symbol = source.vault.stakedToken.symbol;
  } else {
    symbol = source.asset.vToken.underlyingToken.symbol;
  }

  const title = t('lite.formTitle', { symbol, marketName: getMarketName(market) });

  if (source.type === 'hub') {
    return (
      <LiquidityHubFormModal
        title={title}
        vhToken={source.hub.vhToken}
        tabsVariant="primary"
        handleClose={onClose}
      />
    );
  }

  if (source.type === 'vault') {
    return <VenusVaultModal isOpen title={title} vault={source.vault} handleClose={onClose} />;
  }

  if (source.type === 'spoke') {
    return (
      <SpokeFormModal
        title={title}
        spokePool={source.pool}
        asset={source.asset}
        initialActiveTabId="loan"
        initialLoanTabId="borrow"
        handleClose={onClose}
      />
    );
  }

  return (
    <CoreMarketFormModal
      title={title}
      asset={source.asset}
      poolComptrollerAddress={corePoolComptrollerContractAddress}
      initialActiveTabId={mode === 'earn' ? 'supply' : 'borrow'}
      visibleTabIds={mode === 'earn' ? ['supply', 'withdraw'] : ['borrow', 'repay']}
      tabsVariant="primary"
      onClose={onClose}
    />
  );
};
