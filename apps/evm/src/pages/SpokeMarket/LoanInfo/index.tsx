import { MarketInfo, type MarketInfoProps } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { DAYS_PER_YEAR } from 'constants/time';
import { ChainExplorerLink } from 'containers/ChainExplorerLink';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { SpokeAsset } from 'types';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';

export interface LoanInfoProps {
  asset: SpokeAsset;
}

export const LoanInfo: React.FC<LoanInfoProps> = ({ asset }) => {
  const { t } = useTranslation();
  const { chainId } = useChainId();

  const dailyBorrowInterestsCents = asset.borrowBalanceCents
    .multipliedBy(asset.borrowApyPercentage)
    .div(100)
    .div(DAYS_PER_YEAR);

  const items: MarketInfoProps['items'] = [
    {
      label: t('spokeMarket.loanInfo.borrowerCount'),
      children: PLACEHOLDER_KEY,
    },
    {
      label: t('spokeMarket.loanInfo.marketContract'),
      children: (
        <ChainExplorerLink
          hash={asset.vToken.address}
          chainId={chainId}
          text={asset.vToken.address}
        />
      ),
    },
    {
      label: t('spokeMarket.loanInfo.reserveFactor'),
      children: formatPercentageToReadableValue(asset.reserveFactor * 100),
    },
    {
      label: t('spokeMarket.loanInfo.dailyBorrowInterests'),
      children: formatCentsToReadableValue({ value: dailyBorrowInterestsCents }),
    },
    {
      label: t('spokeMarket.loanInfo.suppliable'),
      children: asset.isSuppliable
        ? t('spokeMarket.loanInfo.suppliableYes')
        : t('spokeMarket.loanInfo.suppliableNo'),
    },
  ];

  return <MarketInfo title={t('spokeMarket.loanInfo.title')} items={items} />;
};
