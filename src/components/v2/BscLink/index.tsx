/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { generateBscScanUrl, UrlType } from 'utilities';
import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface IBscLinkProps {
  hash: string;
  urlType?: UrlType;
  className?: string;
}

export const BscLink: React.FC<IBscLinkProps> = ({ hash, className, urlType }) => {
  const { Trans } = useTranslation();
  const styles = useStyles();

  return (
    <div css={styles.container} className={className}>
      <Typography
        component="a"
        href={generateBscScanUrl(hash, urlType)}
        target="_blank"
        rel="noreferrer"
        variant="small1"
        css={styles.text}
      >
        <Trans
          i18nKey="bscLink.content"
          components={{
            Icon: <Icon name="open" css={styles.icon} />,
          }}
        />
      </Typography>
    </div>
  );
};
