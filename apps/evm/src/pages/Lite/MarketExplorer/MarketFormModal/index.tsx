import { TabsSpacingContext, TokenIcon } from 'components';
import { routes } from 'constants/routing';
import { CoreBorrowModal } from 'containers/CoreBorrowModal';
import { CoreSupplyModal } from 'containers/CoreSupplyModal';
import { LiquidityHubFormModal } from 'containers/LiquidityHubFormModal';
import { ModalDetailLink } from 'containers/ModalDetailLink';
import { getSpokeMarketTo } from 'containers/ModalDetailLink/getSpokeMarketTo';
import { SpokeFormModal } from 'containers/SpokeFormModal';
import { VenusVaultModal } from 'containers/VenusVaultModal';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { SUB_TAB_PARAM_KEY, TAB_PARAM_KEY } from 'hooks/useTabs';
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
  const isPrimeLeaderboardEnabled = useIsFeatureEnabled({ name: 'primeLeaderboard' });
  const { source } = market;

  if (source.type === 'core') {
    return mode === 'borrow' && 'collaterals' in source ? (
      <CoreBorrowModal
        asset={source.asset}
        collaterals={source.collaterals}
        preselectedCollateral={preselectedCollateral}
        surface="lite"
        onClose={onClose}
      />
    ) : (
      <CoreSupplyModal asset={source.asset} surface="lite" onClose={onClose} />
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

  const marketName = getMarketName(market);
  let detailLink: React.ReactNode;

  if (source.type === 'hub') {
    detailLink = (
      <ModalDetailLink
        getTo={([tabId, subTabId]) => {
          const searchParams = new URLSearchParams({ [TAB_PARAM_KEY]: tabId ?? 'supply' });

          if (tabId === 'supply' && subTabId) {
            searchParams.set(SUB_TAB_PARAM_KEY, subTabId);
          }

          return {
            pathname: routes.liquidityHub.path.replace(
              ':vhTokenAddress',
              source.hub.vhToken.address,
            ),
            search: searchParams.toString(),
          };
        }}
        destination={t('modalDetailLink.destination.liquidityHub', { tokenSymbol: token.symbol })}
        analyticProps={{
          variant: 'lite_earn_hub',
          destination: 'liquidity_hub',
          poolName: marketName,
          assetSymbol: token.symbol,
        }}
      />
    );
  } else if (source.type === 'vault') {
    detailLink = isPrimeLeaderboardEnabled && (
      <ModalDetailLink
        getTo={() => routes.primeLeaderboard.path}
        destination={t('primeLeaderboard.title')}
        analyticProps={{
          variant: 'lite_earn_xvs_vault',
          destination: 'prime_leaderboard',
          poolName: marketName,
          assetSymbol: token.symbol,
        }}
      />
    );
  } else {
    detailLink = (
      <ModalDetailLink
        getTo={activeTabPath =>
          getSpokeMarketTo({
            spokePoolComptrollerAddress: source.pool.comptrollerAddress,
            spokeVTokenAddress: source.asset.vToken.address,
            activeTabPath,
          })
        }
        destination={t('modalDetailLink.destination.spokeMarket', {
          tokenSymbol: token.symbol,
          poolName: source.pool.name,
        })}
        analyticProps={{
          variant: 'lite_borrow_spoke',
          destination: 'spoke_market',
          poolName: source.pool.name,
          assetSymbol: token.symbol,
        }}
      />
    );
  }

  const title = (
    <span className="inline-flex items-center gap-x-2">
      <TokenIcon token={token} className="shrink-0" />
      {t('lite.formTitle', { symbol: token.symbol, marketName })}
      {detailLink}
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
