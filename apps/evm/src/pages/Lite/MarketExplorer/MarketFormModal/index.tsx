import { TokenIcon } from 'components';
import { LiquidityHubFormModal } from 'containers/LiquidityHubFormModal';
import { MarketFormModal as CoreMarketFormModal } from 'containers/MarketFormModal';
import { SpokeFormModal } from 'containers/SpokeFormModal';
import { VenusVaultModal } from 'containers/VenusVaultModal';
import { useChain } from 'hooks/useChain';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
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

  let token: Token;

  if (source.type === 'hub') {
    token = source.hub.vhToken.underlyingToken;
  } else if (source.type === 'vault') {
    token = source.vault.stakedToken;
  } else {
    token = source.asset.vToken.underlyingToken;
  }

  const title = (
    <span className="inline-flex items-center gap-x-2">
      <TokenIcon token={token} />
      {t('lite.formTitle', { symbol: token.symbol, marketName: getMarketName(market) })}
    </span>
  );

  if (source.type === 'hub') {
    return (
      <LiquidityHubFormModal title={title} vhToken={source.hub.vhToken} handleClose={onClose} />
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
      onClose={onClose}
    />
  );
};
