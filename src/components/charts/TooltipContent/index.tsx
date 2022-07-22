/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';

import { useStyles } from './styles';

export interface TooltipItem {
  label: string;
  value: string | number;
}

export interface TooltipContentProps {
  items: TooltipItem[];
}

const TooltipContent: React.FC<TooltipContentProps> = ({ items }) => {
  const styles = useStyles();

  return (
    <div css={styles.container}>
      {items.map(item => (
        <div css={styles.item} key={`tooltip-content-item-${item.label}`}>
          <Typography css={styles.itemLabel} variant="tiny">
            {item.label}
          </Typography>

          <Typography css={styles.itemValue} variant="small1">
            {item.value}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default TooltipContent;
