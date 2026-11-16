import { TabsSpacingContext, TokenIcon } from 'components';
import { CoreBorrowModal } from 'containers/CoreBorrowModal';
import { CoreSupplyModal } from 'containers/CoreSupplyModal';
import { LiquidityHubFormModal } from 'containers/LiquidityHubFormModal';
import { SpokeFormModal } from 'containers/SpokeFormModal';
import { VenusVaultModal } from 'containers/VenusVaultModal';
import { useTranslation } from 'libs/translations';
import type { Asset, Token } from 'types';
import type { LiteBorrowMarket, LiteEarnMarket } from '../../types';
import { useMarketName } from '../../useMarketName';

export interface MarketFormModalProps {
  market: LiteEarnMarket | LiteBorrowMarket;
  mode: 'earn' | 'borrow';
  preselectedCollateral?: Asset;
  onClose: () => void;
}

const MarketFormModalContent: React.FC<MarketFormModalProps> = ({
  market,
  mode,
  preselectedCollateral,
  onClose,
}) => {
  const { t } = useTranslation();
  const getMarketName = useMarketName();
  const { source } = market;

  if (source.type === 'core') {
    return mode === 'borrow' && 'collaterals' in source ? (
      <CoreBorrowModal
        asset={source.asset}
        collaterals={source.collaterals}
        preselectedCollateral={preselectedCollateral}
        onClose={onClose}
      />
    ) : (
      <CoreSupplyModal asset={source.asset} onClose={onClose} />
    );
  }

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
};

export const MarketFormModal: React.FC<MarketFormModalProps> = props => (
  <TabsSpacingContext.Provider value="compact">
    <MarketFormModalContent {...props} />
  </TabsSpacingContext.Provider>
);
