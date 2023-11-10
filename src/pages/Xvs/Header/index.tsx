/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { EllipseAddress, Icon, LabeledProgressBar, TokenIcon } from 'components';
import { useGetMainPoolComptrollerContractAddress } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { RewardDistributorDistribution, Token } from 'types';
import {
  convertWeiToTokens,
  formatTokensToReadableValue,
  generateChainExplorerUrl,
} from 'utilities';

import {
  useGetBalanceOf,
  useGetMainPool,
  useGetMainPoolTotalXvsDistributed,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useCopyToClipboard from 'hooks/useCopyToClipboard';

import { MINTED_XVS_WEI } from '../constants';
import { useStyles } from '../styles';

interface HeaderProps {
  className?: string;
}

interface HeaderContainerProps {
  remainingDistributionWei: BigNumber;
  dailyXvsDistributedTokens: BigNumber;
  venusVaiVaultDailyRateWei: BigNumber;
  totalXvsDistributedWei: BigNumber;
  xvs: Token;
}

export const HeaderUi: React.FC<HeaderProps & HeaderContainerProps> = ({
  className,
  remainingDistributionWei,
  dailyXvsDistributedTokens,
  venusVaiVaultDailyRateWei,
  totalXvsDistributedWei,
  xvs,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { chainId } = useAuth();

  const copy = useCopyToClipboard(t('interactive.copy.xvsAddress'));
  const copyAddress = () => copy(xvs.address);

  const readableDailyDistribution = useMemo(() => {
    const venusVaiVaultDailyRateTokens = convertWeiToTokens({
      valueWei: venusVaiVaultDailyRateWei,
      token: xvs,
    });

    const dailyDistribution = dailyXvsDistributedTokens.plus(venusVaiVaultDailyRateTokens);

    return formatTokensToReadableValue({
      value: dailyDistribution,
      token: xvs,
    });
  }, [dailyXvsDistributedTokens, venusVaiVaultDailyRateWei, xvs]);

  const readableRemainingDistribution = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: remainingDistributionWei,
        token: xvs,
        returnInReadableFormat: true,
      }),
    [remainingDistributionWei, xvs],
  );

  const percentOfXvsDistributed = useMemo(
    () => totalXvsDistributedWei.dividedBy(MINTED_XVS_WEI).multipliedBy(100).toNumber(),
    [totalXvsDistributedWei],
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
  const { accountAddress } = useAuth();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: venusVaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate();

  const { data: getMainPoolData } = useGetMainPool({
    accountAddress,
  });

  const dailyXvsDistributedTokens = useMemo(
    () =>
      (getMainPoolData?.pool.assets || []).reduce((acc, asset) => {
        // Note: assets from the main pool only yield XVS, hence why we only
        // take the first distribution token in consideration (which will
        // always be XVS here)
        const supplyXvsDistribution = asset.supplyDistributions[0] as RewardDistributorDistribution;
        const borrowXvsDistribution = asset.borrowDistributions[0] as RewardDistributorDistribution;

        const dailyXvsDistributed = supplyXvsDistribution.dailyDistributedTokens.plus(
          borrowXvsDistribution.dailyDistributedTokens,
        );

        return acc.plus(dailyXvsDistributed);
      }, new BigNumber(0)),
    [getMainPoolData?.pool.assets],
  );

  const { data: mainPoolTotalXvsDistributedData } = useGetMainPoolTotalXvsDistributed();

  const mainPoolComptrollerContractAddress = useGetMainPoolComptrollerContractAddress();

  const { data: xvsRemainingDistributionData } = useGetBalanceOf(
    {
      token: xvs!,
      accountAddress: mainPoolComptrollerContractAddress || '',
    },
    {
      enabled: !!mainPoolComptrollerContractAddress,
    },
  );

  return (
    <HeaderUi
      remainingDistributionWei={xvsRemainingDistributionData?.balanceWei || new BigNumber(0)}
      venusVaiVaultDailyRateWei={venusVaiVaultDailyRateData?.dailyRateWei || new BigNumber(0)}
      className={className}
      dailyXvsDistributedTokens={dailyXvsDistributedTokens}
      totalXvsDistributedWei={
        mainPoolTotalXvsDistributedData?.totalXvsDistributedWei || new BigNumber(0)
      }
      xvs={xvs!}
    />
  );
};

export default Header;
