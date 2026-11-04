import { ProtectionModeIndicator, TokenIcon } from 'components';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';

export interface CoreFormModalTitleProps {
  asset: Asset;
}

export const CoreFormModalTitle: React.FC<CoreFormModalTitleProps> = ({ asset }) => {
  const { t } = useTranslation();
  const token = asset.vToken.underlyingToken;

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
      <TokenIcon token={token} />
      {t('lite.formTitle', { symbol: token.symbol, marketName: t('lite.markets.corePool') })}
    </span>
  );
};
