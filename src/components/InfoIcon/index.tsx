/** @jsxImportSource @emotion/react */
import React from 'react';

import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { useStyles } from './styles';

export interface InfoIconProps {
  tooltip: string;
  className?: string;
}

export const InfoIcon = ({ tooltip, className }: InfoIconProps) => {
  const styles = useStyles();

  return (
    <Tooltip css={styles.container} className={className} title={tooltip}>
      <Icon css={styles.icon} name="info" />
    </Tooltip>
  );
};
