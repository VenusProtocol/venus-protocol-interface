import BigNumber from 'bignumber.js';

import { cn } from '@venusprotocol/ui';
import { useGetTokenListUsdPrice } from 'clients/api';
import { CellGroup, type CellProps } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { AnyVault } from 'types';
import {
  areTokensEqual,
  convertPriceMantissaToDollars,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import { checkIsXvsOnZk } from 'utilities/xvsPriceOnZk';
import { XVS_FIXED_PRICE_CENTS } from 'utilities/xvsPriceOnZk/constants';
import { Banner } from './Banner';

export interface OverviewProps {
  vaults: AnyVault[];
  className?: string;
}

export const Overview: React.FC<OverviewProps> = ({ vaults, className }) => {
  const { t, Trans } = useTranslation();

  const { chainId } = useChainId();

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

  const { data: stakedTokenPriceData, isLoading } = useGetTokenListUsdPrice({
    tokens: (vaults ?? []).map(vault => vault.stakedToken),
  });

  const totalStakedUsdCents = stakedTokenPriceData?.reduce((accu, curr, index) => {
    const isXvsOnZk = checkIsXvsOnZk({
      chainId,
      token: vaults[index]?.stakedToken,
      xvs,
    });

    return accu.plus(
      convertPriceMantissaToDollars({
        priceMantissa: vaults[index]?.totalStakedMantissa?.times(
          isXvsOnZk ? new BigNumber(XVS_FIXED_PRICE_CENTS).shiftedBy(-2) : curr?.tokenPriceUsd ?? 0,
        ),
        decimals: vaults[index]?.stakedToken?.decimals,
      }).shiftedBy(2),
    );
  }, new BigNumber(0));

  const overviewCells: CellProps[] = [
    {
      label: t('vault.overview.tvl'),
      value: !isLoading
        ? formatCentsToReadableValue({ value: totalStakedUsdCents })
        : PLACEHOLDER_KEY,
    },
    {
      label: t('vault.overview.highestApr'),
      value:
        vaultWithHighestApr && !isLoading
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

          <p className="text-b1r text-light-grey-active">
            <Trans
              i18nKey="vault.overview.description"
              components={{
                strong: <strong className="font-semibold" />,
              }}
            />
          </p>
        </div>

        {/* Stats */}
        <CellGroup variant="secondary" cells={overviewCells} />
      </div>

      {featuredVault && <Banner vault={featuredVault} />}
    </div>
  );
};
