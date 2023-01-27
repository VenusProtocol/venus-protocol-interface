/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { Token } from 'types';

import { Icon, IconName } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import { Tooltip } from '../Tooltip';
import { useStyles } from './styles';

export interface LabeledInlineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  invertTextColors?: boolean;
  iconSrc?: IconName | Token;
}

export const LabeledInlineContent = ({
  label,
  tooltip,
  iconSrc,
  invertTextColors = false,
  children,
  ...otherContainerProps
}: LabeledInlineContentProps) => {
  const styles = useStyles();

  return (
    <div css={styles.container} {...otherContainerProps}>
      <div css={styles.column}>
        {typeof iconSrc === 'string' && <Icon name={iconSrc} css={styles.icon} />}

        {!!iconSrc && typeof iconSrc !== 'string' && (
          <TokenIcon token={iconSrc} css={styles.icon} />
        )}

        <Typography component="span" css={styles.getLabel({ invertTextColors })} variant="body1">
          {label}
        </Typography>
        {!!tooltip && (
          <Tooltip css={styles.tooltip} title={tooltip}>
            <Icon css={styles.infoIcon} name="info" />
          </Tooltip>
        )}
      </div>

      <Typography
        component="div"
        css={[styles.column, styles.getContent({ invertTextColors, hasIcon: !!iconSrc })]}
        variant="body1"
      >
        {children}
      </Typography>
    </div>
  );
};
