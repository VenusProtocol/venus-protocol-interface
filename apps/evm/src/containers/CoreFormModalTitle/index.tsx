import { useGetPool } from 'clients/api';
import { ProtectionModeIndicator, TokenIcon } from 'components';
import { routes } from 'constants/routing';
import { ModalDetailLink } from 'containers/ModalDetailLink';
import { useChain } from 'hooks/useChain';
import { TAB_PARAM_KEY } from 'hooks/useTabs';
import type { ProShortcutVariant } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset } from 'types';
import { getMarketTabId } from './getMarketTabId';

export interface CoreFormModalTitleProps {
  asset: Asset;
  side: 'supply' | 'borrow';
  surface: 'dashboard' | 'lite';
}

const variants: Record<
  CoreFormModalTitleProps['surface'],
  Record<CoreFormModalTitleProps['side'], ProShortcutVariant>
> = {
  dashboard: { supply: 'dashboard_core_supply', borrow: 'dashboard_core_borrow' },
  lite: { supply: 'lite_earn_core', borrow: 'lite_borrow_core' },
};

export const CoreFormModalTitle: React.FC<CoreFormModalTitleProps> = ({ asset, side, surface }) => {
  const { t } = useTranslation();
  const { corePoolComptrollerContractAddress } = useChain();
  const { accountAddress } = useAccountAddress();
  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const token = asset.vToken.underlyingToken;
  const marketName = t('lite.markets.corePool');

  return (
    <span className="inline-flex items-center gap-x-2">
      {asset.isProtectionModeEnabled && (
        <ProtectionModeIndicator
          variant="icon"
          tokenName={token.symbol}
          tokenSupplyPriceCents={asset.tokenSupplyPriceCents}
          tokenBorrowPriceCents={asset.tokenBorrowPriceCents}
        />
      )}
      <TokenIcon token={token} className="shrink-0" />
      {t('lite.formTitle', { symbol: token.symbol, marketName })}
      <ModalDetailLink
        getTo={activeTabPath => ({
          pathname: routes.market.path
            .replace(':poolComptrollerAddress', corePoolComptrollerContractAddress)
            .replace(':vTokenAddress', asset.vToken.address),
          search: `${TAB_PARAM_KEY}=${getMarketTabId({ side, activeTabPath })}`,
        })}
        destination={t('modalDetailLink.destination.coreMarket', { tokenSymbol: token.symbol })}
        analyticProps={{
          variant: variants[surface][side],
          destination: 'core_market',
          poolName: getPoolData?.pool.name ?? '',
          assetSymbol: token.symbol,
        }}
      />
    </span>
  );
};
