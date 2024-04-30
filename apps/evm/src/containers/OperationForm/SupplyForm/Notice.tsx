import { NoticeError, NoticeWarning } from 'components';
import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { Asset, Swap } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import TEST_IDS from './testIds';
import type { FormError } from './useForm';

export interface NoticeProps {
  asset: Asset;
  swap?: Swap;
  formError?: FormError;
}

const Notice: React.FC<NoticeProps> = ({ asset, swap, formError }) => {
  const { t } = useTranslation();

  if (formError === 'SUPPLY_CAP_ALREADY_REACHED') {
    // Supply cap has been reached so supplying more is forbidden
    return (
      <NoticeError
        data-testid={TEST_IDS.noticeError}
        description={t('operationModal.supply.supplyCapReachedWarning', {
          assetSupplyCap: formatTokensToReadableValue({
            value: asset.supplyCapTokens,
            token: asset.vToken.underlyingToken,
          }),
        })}
      />
    );
  }

  if (formError === 'HIGHER_THAN_SUPPLY_CAP' && asset.supplyCapTokens) {
    // User is trying to supply above supply cap
    return (
      <NoticeError
        data-testid={TEST_IDS.noticeError}
        description={t('operationModal.supply.amountAboveSupplyCapWarning', {
          userMaxSupplyAmount: formatTokensToReadableValue({
            value: asset.supplyCapTokens.minus(asset.supplyBalanceTokens),
            token: asset.vToken.underlyingToken,
          }),
          assetSupplyCap: formatTokensToReadableValue({
            value: asset.supplyCapTokens,
            token: asset.vToken.underlyingToken,
          }),
          assetSupplyBalance: formatTokensToReadableValue({
            value: asset.supplyBalanceTokens,
            token: asset.vToken.underlyingToken,
          }),
        })}
      />
    );
  }

  if (formError === 'HIGHER_THAN_WALLET_SPENDING_LIMIT') {
    // User is trying to supply above their spending limit
    return <NoticeError description={t('operationModal.supply.amountAboveWalletSpendingLimit')} />;
  }

  if (
    !formError &&
    !!swap?.priceImpactPercentage &&
    swap?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE
  ) {
    // User is trying to swap and supply with a high price impact
    return (
      <NoticeWarning
        className="mt-3"
        description={t('operationModal.supply.swappingWithHighPriceImpactWarning')}
      />
    );
  }

  return null;
};

export default Notice;
