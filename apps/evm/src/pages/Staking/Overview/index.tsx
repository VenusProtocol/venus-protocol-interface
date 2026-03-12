import BigNumber from 'bignumber.js';

import { cn } from '@venusprotocol/ui';
import { useGetTokenListUsdPrice } from 'clients/api/queries/getTokenUsdPrice/useGetTokenListUsdPrice';
import { CellGroup, type CellProps } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import type { ActiveModal } from 'containers/Vault';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { Vault } from 'types';
import {
  areTokensEqual,
  convertPriceMantissaToDollars,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import { Banner } from './Banner';

export interface OverviewProps {
  vaults: Vault[];
  onOpenModal?: (vault: Vault, activeModal: ActiveModal) => void;
  className?: string;
}

export const Overview: React.FC<OverviewProps> = ({ vaults, onOpenModal, className }) => {
  const { t } = useTranslation();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const vaultWithHighestApr = [...(vaults ?? [])].sort(
    (a, b) => b.stakingAprPercentage - a.stakingAprPercentage,
  )[0];

  const featuredVault =
    (vaults ?? []).find(vault => xvs && areTokensEqual(vault.stakedToken, xvs)) ??
    vaultWithHighestApr;

  const totalVault = (vaults ?? []).length;

  const stakedTokenPriceResults = useGetTokenListUsdPrice({
    tokens: (vaults ?? []).map(vault => vault.stakedToken),
  });

  const totalStakedUsdCents = stakedTokenPriceResults.reduce((accu, curr, index) => {
    return accu.plus(
      convertPriceMantissaToDollars({
        priceMantissa: vaults[index]?.totalStakedMantissa?.times(curr.data?.tokenPriceUsd ?? 0),
        decimals: vaults[index]?.stakedToken?.decimals,
      }).shiftedBy(2),
    );
  }, BigNumber(0));

  const overviewCells: CellProps[] = [
    {
      label: t('vault.overview.tvl'),
      value:
        totalStakedUsdCents !== undefined
          ? formatCentsToReadableValue({ value: totalStakedUsdCents })
          : PLACEHOLDER_KEY,
    },
    {
      label: t('vault.overview.highestApr'),
      value:
        vaultWithHighestApr !== undefined
          ? formatPercentageToReadableValue(vaultWithHighestApr.stakingAprPercentage)
          : PLACEHOLDER_KEY,
    },
    {
      label: t('vault.overview.totalVault'),
      value: totalVault,
    },
  ];

  return (
    <div className={cn('flex flex-col gap-6 lg:gap-12 lg:flex-row lg:items-start', className)}>
      {/* Left: title, description, stats */}
      <div className="flex flex-col gap-6 flex-1">
        {/* Title + description */}
        <div className="flex flex-col gap-3">
          <h1 className="text-h6">{t('vault.overview.title')}</h1>

          <p className="text-b1r text-grey">{t('vault.overview.description')}</p>
        </div>

        {/* Stats */}
        <CellGroup variant="secondary" cells={overviewCells} />
      </div>

      <Banner vault={featuredVault} onOpenModal={onOpenModal} />
    </div>
  );
};
