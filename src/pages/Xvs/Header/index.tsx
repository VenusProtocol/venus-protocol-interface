/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Paper, Typography } from '@mui/material';
import {
  useGetVenusVaiVaultDailyRateWei,
  useGetBalanceOf,
  useGetUserMarketInfo,
} from 'clients/api';
import { EllipseText, Icon, LabeledProgressBar } from 'components';
import { AuthContext } from 'context/AuthContext';
import useCopyToClipboard from 'hooks/useCopyToClipoard';
import {
  getToken,
  generateBscScanUrl,
  getContractAddress,
  convertWeiToTokens,
  formatTokensToReadableValue,
} from 'utilities';
import { useTranslation } from 'translation';
import { useStyles } from '../styles';
import { MINTED_XVS_WEI } from '../constants';

interface IHeaderProps {
  className?: string;
}

interface IHeaderContainerProps {
  remainingDistributionWei: BigNumber;
  dailyVenusWei: BigNumber;
  venusVaiVaultDailyRateWei: BigNumber;
  totalXvsDistributedWei: BigNumber;
}

export const HeaderUi: React.FC<IHeaderProps & IHeaderContainerProps> = ({
  className,
  remainingDistributionWei,
  dailyVenusWei,
  venusVaiVaultDailyRateWei,
  totalXvsDistributedWei,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const xvsAddress = getToken('xvs').address;
  const copy = useCopyToClipboard(t('interactive.copy.xvsAddress'));
  const copyAddress = () => copy(xvsAddress);

  const readableDailyDistribution = useMemo(() => {
    const dailyVenusTokens = convertWeiToTokens({
      valueWei: dailyVenusWei,
      tokenId: 'xvs',
    });

    const venusVaiVaultDailyRateTokens = convertWeiToTokens({
      valueWei: venusVaiVaultDailyRateWei,
      tokenId: 'xvs',
    });

    const dailyDistribution = dailyVenusTokens.plus(venusVaiVaultDailyRateTokens);

    return formatTokensToReadableValue({
      value: dailyDistribution,
      tokenId: 'xvs',
      minimizeDecimals: true,
    });
  }, [dailyVenusWei.toFixed(), venusVaiVaultDailyRateWei.toFixed()]);

  const readableRemainingDistribution = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: remainingDistributionWei,
        tokenId: 'xvs',
        returnInReadableFormat: true,
        minimizeDecimals: true,
      }),
    [remainingDistributionWei.toFixed()],
  );

  const percentOfXvsDistributed = useMemo(
    () => totalXvsDistributedWei.dividedBy(MINTED_XVS_WEI).multipliedBy(100).toNumber(),
    [],
  );

  return (
    <Paper className={className} css={styles.headerRoot}>
      <EllipseText css={styles.address} text={xvsAddress}>
        <div css={styles.xvsIconContainer}>
          <Icon name="xvs" size={styles.iconSize} />
        </div>

        <Typography
          className="ellipse-text"
          href={generateBscScanUrl('xvs')}
          target="_blank"
          rel="noreferrer"
          variant="small2"
          component="a"
          css={[styles.whiteText, styles.addressText]}
        />

        <div css={styles.copyIconContainer}>
          <Icon name="copy" onClick={copyAddress} css={styles.copyIcon} size={styles.iconSizeXl} />
        </div>
      </EllipseText>

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

const Header: React.FC<IHeaderProps> = ({ className }) => {
  const { account } = useContext(AuthContext);
  const { data: venusVaiVaultDailyRateWei } = useGetVenusVaiVaultDailyRateWei();
  const {
    data: { dailyVenusWei, totalXvsDistributedWei },
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });
  const { data: xvsRemainingDistribution } = useGetBalanceOf({
    tokenId: 'xvs',
    accountAddress: getContractAddress('comptroller'),
  });

  return (
    <HeaderUi
      remainingDistributionWei={xvsRemainingDistribution || new BigNumber(0)}
      venusVaiVaultDailyRateWei={venusVaiVaultDailyRateWei || new BigNumber(0)}
      className={className}
      dailyVenusWei={dailyVenusWei}
      totalXvsDistributedWei={totalXvsDistributedWei}
    />
  );
};

export default Header;
