/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import generateBscScanAddressUrl from 'utilities/generateBscScanAddressUrl';
import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface IBscLinkProps {
  hash: string;
  className?: string;
}

export const BscLink: React.FC<IBscLinkProps> = ({ hash, className }) => {
  const styles = useStyles();

  return (
    <div css={styles.container} className={className}>
      <Typography
        component="a"
        href={generateBscScanAddressUrl(hash)}
        target="_blank"
        rel="noreferrer"
        variant="small1"
        css={styles.text}
      >
        View on bscscan.com
        <Icon name="open" css={styles.icon} />
      </Typography>
    </div>
  );
};
