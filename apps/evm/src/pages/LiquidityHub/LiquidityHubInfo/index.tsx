import { cn } from '@venusprotocol/ui';

import { MarketInfo, type MarketInfoProps } from 'components';
import { routes } from 'constants/routing';
import { DAYS_PER_YEAR } from 'constants/time';
import { ChainExplorerLink } from 'containers/ChainExplorerLink';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { LiquidityHub } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  getCombinedApy,
} from 'utilities';

export interface LiquidityHubInfoProps {
  liquidityHub: LiquidityHub;
}

export const LiquidityHubInfo: React.FC<LiquidityHubInfoProps> = ({ liquidityHub }) => {
  const { t, Trans } = useTranslation();
  const { chainId } = useChainId();

  const { totalApyPercentage } = getCombinedApy({
    type: 'supply',
    baseApyPercentage: liquidityHub.supplyApyPercentage,
    tokenDistributions: liquidityHub.supplyTokenDistributions,
  });

  const readableDailySupplyingInterests = formatCentsToReadableValue({
    value: liquidityHub.supplyBalanceCents
      .multipliedBy(totalApyPercentage)
      .dividedBy(100)
      .dividedBy(DAYS_PER_YEAR),
  });

  const stats: MarketInfoProps['items'] = [
    {
      label: t('liquidityHub.info.stats.operator'),
      children: liquidityHub.operatorName,
    },
    {
      label: t('liquidityHub.info.stats.hubContract'),
      children: (
        <ChainExplorerLink
          hash={liquidityHub.hubAddress}
          text={liquidityHub.hubAddress}
          chainId={chainId}
        />
      ),
    },
    {
      label: t('liquidityHub.info.stats.vhTokenContract', {
        vhTokenSymbol: liquidityHub.vhToken.symbol,
      }),
      children: (
        <ChainExplorerLink
          hash={liquidityHub.vhToken.address}
          text={liquidityHub.vhToken.address}
          chainId={chainId}
        />
      ),
    },
    {
      label: t('liquidityHub.info.stats.performanceFee'),
      children: formatPercentageToReadableValue(liquidityHub.performanceFeePercentage),
    },
    {
      label: t('liquidityHub.info.stats.redeemFee'),
      children: formatPercentageToReadableValue(liquidityHub.redeemFeePercentage),
    },
    {
      label: t('liquidityHub.info.stats.dailySupplyingInterests'),
      children: readableDailySupplyingInterests,
    },
    {
      label: t('liquidityHub.info.stats.exchangeRate.title'),
      children: t('liquidityHub.info.stats.exchangeRate.value', {
        vhTokenSymbol: liquidityHub.vhToken.symbol,
        underlyingTokenSymbol: liquidityHub.vhToken.underlyingToken.symbol,
        exchangeRate: liquidityHub.pricePerShare.dp(6).toFixed(),
      }),
    },
    {
      label: t('liquidityHub.info.stats.riskDisclosures.title'),
      children: (
        <Trans
          i18nKey="liquidityHub.info.stats.riskDisclosures.value"
          components={{
            Span: <span className="text-b1r" />,
            Ul: <ul className="list-disc ml-5" />,
            Li: <li className="text-b1r" />,
            // TODO: check this is the link we want to redirect to
            Link: <Link to={routes.termsOfUse.path} target="_blank" />,
          }}
        />
      ),
      className: cn('flex-col gap-y-3'),
    },
  ];

  return <MarketInfo title={t('liquidityHub.info.title')} items={stats} />;
};
