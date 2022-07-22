/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';

import { Icon } from '../../Icon';
import { useStyles } from './styles';

export interface BannerProps {
  showBanner: boolean;
  bannerText: string;
}

export const Banner: React.FC<BannerProps> = ({ showBanner, bannerText }) => {
  const styles = useStyles();

  if (showBanner) {
    return (
      <div css={styles.container}>
        <div css={styles.content}>
          <Icon name="attention" css={styles.icon} />

          <Typography variant="small1" css={styles.text}>
            {bannerText}
          </Typography>
        </div>
      </div>
    );
  }

  return null;
};
