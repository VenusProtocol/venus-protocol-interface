/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Paper, Typography } from '@mui/material';
import { EllipseText, Icon, LabeledProgressBar } from 'components';
import copy from 'copy-to-clipboard';
import { getToken, generateBscScanUrl } from 'utilities';
import { formatCoinsToReadableValue } from 'utilities/common';
import { useTranslation } from 'translation';
import { useStyles } from '../styles';
import { MINTED_XVS_WEI } from '../constants';

interface IHeaderProps {
  className?: string;
}

interface IHeaderContainerProps {
  remainingDistribution: BigNumber;
  dailyVenus: BigNumber;
  venusVaiVaultRate: BigNumber;
  totalXvsDistributedWei: BigNumber;
}

export const HeaderUi: React.FC<IHeaderProps & IHeaderContainerProps> = ({
  className,
  remainingDistribution,
  dailyVenus,
  venusVaiVaultRate,
  totalXvsDistributedWei,
}) => {
  const styles = useStyles();
  const xvsAddress = getToken('xvs').address;
  const copyAddress = () => copy(xvsAddress);
  const { t } = useTranslation();

  const readableDailyDistribution = useMemo(() => {
    const dailyDistribution = dailyVenus
      .div(new BigNumber(10).pow(getToken('xvs').decimals))
      .plus(venusVaiVaultRate);

    return formatCoinsToReadableValue({
      value: dailyDistribution,
      tokenId: 'xvs',
      shorthand: true,
    });
  }, [dailyVenus.toFixed(), venusVaiVaultRate]);

  const readableRemainingDistribution = useMemo(
    () => formatCoinsToReadableValue({ value: remainingDistribution, tokenId: 'xvs' }),
    [remainingDistribution.toFixed()],
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

const Header: React.FC<IHeaderProps> = ({ className }) => (
  <HeaderUi
    remainingDistribution={new BigNumber('5072435.34')}
    venusVaiVaultRate={new BigNumber('6451.2')}
    className={className}
    dailyVenus={new BigNumber('11241610019199999648000')}
    totalXvsDistributedWei={new BigNumber('10008323501130')}
  />
);

export default Header;
