import { Modal, ProtectionModeIndicator, TokenIcon } from 'components';
import { GatedAssetAcknowledgementModal } from 'containers/GatedAssetAcknowledgementModal';
import { LiquidityHubFormModal } from 'containers/LiquidityHubFormModal';
import { MarketFormModal as CoreMarketFormModal } from 'containers/MarketFormModal';
import { SpokeFormModal } from 'containers/SpokeFormModal';
import { VenusVaultModal } from 'containers/VenusVaultModal';
import { useChain } from 'hooks/useChain';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import type { Asset, Token } from 'types';
import type { LiteBorrowMarket, LiteEarnMarket } from '../../types';
import { useMarketName } from '../../useMarketName';
import { CoreBorrowForm } from './CoreBorrowForm';

export interface MarketFormModalProps {
  market: LiteEarnMarket | LiteBorrowMarket;
  mode: 'earn' | 'borrow';
  preselectedCollateral?: Asset;
  onClose: () => void;
}

export const MarketFormModal: React.FC<MarketFormModalProps> = ({
  market,
  mode,
  preselectedCollateral,
  onClose,
}) => {
  const { t } = useTranslation();
  const [userChainSettings] = useUserChainSettings();
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
      {source.type === 'core' && source.asset.isProtectionModeEnabled && (
        <ProtectionModeIndicator
          variant="icon"
          tokenName={token.symbol}
          tokenSupplyPriceCents={source.asset.tokenSupplyPriceCents}
          tokenBorrowPriceCents={source.asset.tokenBorrowPriceCents}
        />
      )}
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

  if (mode === 'borrow' && 'collaterals' in source) {
    if (source.asset.isGated && !userChainSettings.doNotShowGatedAssetModal) {
      return <GatedAssetAcknowledgementModal onReject={onClose} />;
    }

    return (
      <Modal isOpen title={title} handleClose={onClose}>
        <CoreBorrowForm
          asset={source.asset}
          collaterals={source.collaterals}
          preselectedCollateral={preselectedCollateral}
          onSubmitSuccess={onClose}
        />
      </Modal>
    );
  }

  return (
    <CoreMarketFormModal
      title={title}
      asset={source.asset}
      poolComptrollerAddress={corePoolComptrollerContractAddress}
      initialActiveTabId={mode === 'earn' ? 'supply' : 'borrow'}
      visibleTabIds={mode === 'earn' ? ['supply', 'withdraw'] : ['borrow', 'repay']}
      disableIntegratedSwap
      onClose={onClose}
    />
  );
};
