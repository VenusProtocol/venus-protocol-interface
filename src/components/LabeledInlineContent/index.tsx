/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';

import { Icon, IconName } from '../Icon';
import { useStyles } from './styles';

export interface LabeledInlineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  children: React.ReactNode;
  invertTextColors?: boolean;
  iconName?: IconName;
}

export const LabeledInlineContent = ({
  label,
  iconName,
  invertTextColors = false,
  children,
  ...otherContainerProps
}: LabeledInlineContentProps) => {
  const styles = useStyles();

  return (
    <div css={styles.container} {...otherContainerProps}>
      <div css={styles.column}>
        {iconName && <Icon name={iconName} css={styles.icon} />}

        <Typography component="span" css={styles.getLabel({ invertTextColors })} variant="body1">
          {label}
        </Typography>
      </div>

      <Typography
        component="div"
        css={[styles.column, styles.getContent({ invertTextColors, hasIcon: !!iconName })]}
        variant="body1"
      >
        {children}
      </Typography>
    </div>
  );
};
