/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useGetLegacyPoolComptrollerContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { useMemo } from 'react';

import {
  useGetBalanceOf,
  useGetLegacyPool,
  useGetLegacyPoolTotalXvsDistributed,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { EllipseAddress, Icon, LabeledProgressBar, TokenIcon } from 'components';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { RewardDistributorDistribution, Token } from 'types';
import {
  convertMantissaToTokens,
  formatTokensToReadableValue,
  generateChainExplorerUrl,
} from 'utilities';

import { MINTED_XVS_MANTISSA } from '../constants';
import { useStyles } from '../styles';

interface HeaderProps {
  className?: string;
}

interface HeaderContainerProps {
  remainingDistributionMantissa: BigNumber;
  dailyXvsDistributedTokens: BigNumber;
  venusVaiVaultDailyRateMantissa: BigNumber;
  totalXvsDistributedMantissa: BigNumber;
  xvs: Token;
}

export const HeaderUi: React.FC<HeaderProps & HeaderContainerProps> = ({
  className,
  remainingDistributionMantissa,
  dailyXvsDistributedTokens,
  venusVaiVaultDailyRateMantissa,
  totalXvsDistributedMantissa,
  xvs,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { chainId } = useChainId();

  const copy = useCopyToClipboard(t('interactive.copy.xvsAddress'));
  const copyAddress = () => copy(xvs.address);

  const readableDailyDistribution = useMemo(() => {
    const venusVaiVaultDailyRateTokens = convertMantissaToTokens({
      value: venusVaiVaultDailyRateMantissa,
      token: xvs,
    });

    const dailyDistribution = dailyXvsDistributedTokens.plus(venusVaiVaultDailyRateTokens);

    return formatTokensToReadableValue({
      value: dailyDistribution,
      token: xvs,
    });
  }, [dailyXvsDistributedTokens, venusVaiVaultDailyRateMantissa, xvs]);

  const readableRemainingDistribution = useMemo(
    () =>
      convertMantissaToTokens({
        value: remainingDistributionMantissa,
        token: xvs,
        returnInReadableFormat: true,
      }),
    [remainingDistributionMantissa, xvs],
  );

  const percentOfXvsDistributed = useMemo(
    () => totalXvsDistributedMantissa.dividedBy(MINTED_XVS_MANTISSA).multipliedBy(100).toNumber(),
    [totalXvsDistributedMantissa],
  );

  return (
    <Paper className={className} css={styles.headerRoot}>
      <div css={styles.addressContainer}>
        <TokenIcon token={xvs} />

        <Typography
          href={generateChainExplorerUrl({
            hash: xvs.address,
            urlType: 'token',
            chainId,
          })}
          target="_blank"
          rel="noreferrer"
          variant="small2"
          component="a"
          css={[styles.whiteText, styles.addressText]}
        >
          <EllipseAddress address={xvs.address} ellipseBreakpoint="xl" />
        </Typography>

        <div css={styles.copyIconContainer}>
          <Icon name="copy" onClick={copyAddress} css={styles.copyIcon} size={styles.iconSizeXl} />
        </div>
      </div>

      <div css={styles.slider}>
        <LabeledProgressBar
          css={styles.progressBar}
          min={1}
          max={100}
          step={1}
          value={percentOfXvsDistributed}
          ariaLabel={t('xvs.progressBar')}
          greyLeftText={t('xvs.dailyDistribution')}
          whiteLeftText={readableDailyDistribution}
          greyRightText={t('xvs.remaining')}
          whiteRightText={readableRemainingDistribution}
        />
      </div>
    </Paper>
  );
};

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { accountAddress } = useAccountAddress();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: venusVaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate();

  const { data: getLegacyPoolData } = useGetLegacyPool({
    accountAddress,
  });

  const dailyXvsDistributedTokens = useMemo(
    () =>
      (getLegacyPoolData?.pool.assets || []).reduce((acc, asset) => {
        // Note: assets from the legacy pool only yield XVS, hence why we only
        // take the first distribution token in consideration (which will
        // always be XVS here)
        const supplyXvsDistribution = asset.supplyDistributions[0] as RewardDistributorDistribution;
        const borrowXvsDistribution = asset.borrowDistributions[0] as RewardDistributorDistribution;

        const dailyXvsDistributed = supplyXvsDistribution.dailyDistributedTokens.plus(
          borrowXvsDistribution.dailyDistributedTokens,
        );

        return acc.plus(dailyXvsDistributed);
      }, new BigNumber(0)),
    [getLegacyPoolData?.pool.assets],
  );

  const { data: legacyPoolTotalXvsDistributedData } = useGetLegacyPoolTotalXvsDistributed();

  const legacyPoolComptrollerContractAddress = useGetLegacyPoolComptrollerContractAddress();

  const { data: xvsRemainingDistributionData } = useGetBalanceOf(
    {
      token: xvs!,
      accountAddress: legacyPoolComptrollerContractAddress || '',
    },
    {
      enabled: !!legacyPoolComptrollerContractAddress,
    },
  );

  return (
    <HeaderUi
      remainingDistributionMantissa={
        xvsRemainingDistributionData?.balanceMantissa || new BigNumber(0)
      }
      venusVaiVaultDailyRateMantissa={
        venusVaiVaultDailyRateData?.dailyRateMantissa || new BigNumber(0)
      }
      className={className}
      dailyXvsDistributedTokens={dailyXvsDistributedTokens}
      totalXvsDistributedMantissa={
        legacyPoolTotalXvsDistributedData?.totalXvsDistributedMantissa || new BigNumber(0)
      }
      xvs={xvs!}
    />
  );
};

export default Header;
