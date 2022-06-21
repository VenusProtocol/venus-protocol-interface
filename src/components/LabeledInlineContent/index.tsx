/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { Icon, IconName } from '../Icon';
import { useStyles } from './styles';

export interface ILabeledInlineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  iconName?: IconName;
  children: React.ReactNode;
  invertTextColors?: boolean;
  iconName?: IconName;
}

export const LabeledInlineContent = ({
  label,
  iconName,
  children,
  ...otherContainerProps
}: ILabeledInlineContentProps) => {
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
        css={[styles.column, styles.getContent({ invertTextColors })]}
        variant="body1"
      >
        {children}
      </Typography>
    </div>
  );
};
