/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { generateBscScanUrl, UrlType } from 'utilities';
import { EllipseAddress, Breakpoint } from '../EllipseAddress';
import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface IBscLinkProps {
  hash: string;
  ellipseBreakpoint?: Breakpoint;
  urlType?: UrlType;
  className?: string;
  text?: string;
}

export const BscLink: React.FC<IBscLinkProps> = ({
  hash,
  className,
  urlType,
  text,
  ellipseBreakpoint,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  let content;

  if (text) {
    content = ellipseBreakpoint ? (
      <EllipseAddress ellipseBreakpoint={ellipseBreakpoint} address={text} />
    ) : (
      text
    );
  } else {
    content = t('bscLink.content');
  }

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
        {content}

        <Icon name="open" css={styles.icon} />
      </Typography>
    </div>
  );
};
