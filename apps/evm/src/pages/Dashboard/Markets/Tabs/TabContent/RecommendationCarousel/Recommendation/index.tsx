import type { Address } from 'viem';

import { Apy, Card, Delimiter, TokenIconWithSymbol } from 'components';
import { Link } from 'containers/Link';
import type { MarketTableProps } from 'containers/MarketTable';
import { useMarketPageTo } from 'hooks/useMarketPageTo';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import { formatCentsToReadableValue } from 'utilities';
import { Cell } from './Cell';

export interface RecommendationProps {
  type: MarketTableProps['marketType'];
  asset: Asset;
  poolComptrollerContractAddress: Address;
}

export const Recommendation: React.FC<RecommendationProps> = ({
  type,
  asset,
  poolComptrollerContractAddress,
}) => {
  const { t } = useTranslation();

  const readableSupplyBalance = formatCentsToReadableValue({
    value: asset.supplyBalanceCents,
  });

  const { formatMarketPageTo } = useMarketPageTo();

  const to = formatMarketPageTo({
    poolComptrollerContractAddress,
    vTokenAddress: asset.vToken.address,
    tabId: type,
  });

  return (
    <Card
      className="flex flex-col transition-colors pb-9 sm:flex-wrap sm:p-4 hover:bg-dark-blue-hover active:bg-dark-blue-active"
      asChild
    >
      <Link noStyle chainId={asset.vToken.chainId} to={to}>
        <div className="space-y-4">
          <p className="text-b1s text-light-grey sm:text-b2r">
            {t('markets.recommendations.recommendation.title')}
          </p>

          <div className="flex flex-col gap-y-4 sm:grid sm:grid-cols-4 sm:items-center sm:gap-x-8">
            <div className="shrink-0 sm:col-span-1">
              <TokenIconWithSymbol token={asset.vToken.underlyingToken} displayChain />
            </div>

            <Delimiter className="sm:hidden" />

            <div className="flex flex-col gap-y-6 sm:flex-row sm:col-span-3 sm:grid sm:grid-cols-3 sm:gap-x-8">
              <Cell label={t('markets.recommendations.recommendation.supplyApyLabel')}>
                <Apy asset={asset} type="supply" />
              </Cell>

              <Cell label={t('markets.recommendations.recommendation.borrowApyLabel')}>
                <Apy asset={asset} type="borrow" />
              </Cell>

              <Cell label={t('markets.recommendations.recommendation.supplyBalanceLabel')}>
                <p>{readableSupplyBalance}</p>
              </Cell>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
