/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'translation';
import { ChainId } from 'types';
import { UrlType, generateBscScanUrl } from 'utilities';

import { Breakpoint, EllipseAddress } from '../EllipseAddress';
import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface BscLinkProps {
  hash: string;
  chainId?: ChainId;
  ellipseBreakpoint?: Breakpoint;
  urlType?: UrlType;
  className?: string;
  text?: string;
}

export const BscLink: React.FC<BscLinkProps> = ({
  hash,
  chainId,
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
        href={chainId && generateBscScanUrl({ hash, urlType, chainId })}
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
