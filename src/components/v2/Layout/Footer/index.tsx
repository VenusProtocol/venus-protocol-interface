/** @jsxImportSource @emotion/react */
import React from 'react';

import Typography from '@mui/material/Typography';
import {
  BASE_BSC_SCAN_URL,
  VENUS_MEDIUM_URL,
  VENUS_DISCORD_URL,
  VENUS_TWITTER_URL,
  VENUS_GITHUB_URL,
  ETHERSCAN_XVS_CONTRACT_ADDRESS,
} from 'config';
import { generateBscScanUrl } from 'utilities';
import { useBlock } from 'hooks/useBlock';
import { useTranslation } from 'translation';
import { Icon } from 'components/v2/Icon';
import { useStyles } from './styles';

export interface IFooterProps {
  currentBlockNumber: number;
}

export const Footer: React.FC<IFooterProps> = ({ currentBlockNumber }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <div css={styles.container}>
      <Typography
        component="a"
        variant="small2"
        css={styles.blockInfo}
        href={BASE_BSC_SCAN_URL}
        target="_blank"
        rel="noreferrer"
      >
        {t('footer.latestNumber')}
        <br css={styles.blockInfoMobileLineBreak} />
        <span css={styles.blockInfoNumber}>{currentBlockNumber}</span>
      </Typography>

      <div css={styles.links}>
        <a
          css={styles.link}
          href={generateBscScanUrl(ETHERSCAN_XVS_CONTRACT_ADDRESS)}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="venus" color={styles.theme.palette.text.primary} size="12px" />
        </a>

        <a css={styles.link} href={VENUS_MEDIUM_URL} target="_blank" rel="noreferrer">
          <Icon name="medium" color={styles.theme.palette.text.primary} size="12px" />
        </a>

        <a css={styles.link} href={VENUS_DISCORD_URL} target="_blank" rel="noreferrer">
          <Icon name="discord" color={styles.theme.palette.text.primary} size="12px" />
        </a>

        <a css={styles.link} href={VENUS_TWITTER_URL} target="_blank" rel="noreferrer">
          <Icon name="twitter" color={styles.theme.palette.text.primary} size="12px" />
        </a>

        <a css={styles.link} href={VENUS_GITHUB_URL} target="_blank" rel="noreferrer">
          <Icon name="github" color={styles.theme.palette.text.primary} size="12px" />
        </a>
      </div>
    </div>
  );
};

const FooterContainer: React.FC = () => {
  const currentBlockNumber = useBlock();
  return <Footer currentBlockNumber={currentBlockNumber} />;
};

export default FooterContainer;
