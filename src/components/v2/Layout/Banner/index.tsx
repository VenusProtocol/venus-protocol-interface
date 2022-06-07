/** @jsxImportSource @emotion/react */
import React from 'react';
import { NoticeWarning } from '../../Notice';
import { useStyles } from './styles';

export interface IBannerProps {
  showBanner: boolean;
  bannerText: string;
}

export const Banner: React.FC<IBannerProps> = ({ showBanner, bannerText }) => {
  const styles = useStyles();
  if (showBanner) {
    return <NoticeWarning css={styles.banner} description={bannerText} />;
  }
  return null;
};
