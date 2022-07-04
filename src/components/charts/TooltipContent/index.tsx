/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { useStyles } from './styles';

export interface ITooltipItem {
  label: string;
  value: string | number;
}

export interface ITooltipContentProps {
  items: ITooltipItem[];
}

const TooltipContent: React.FC<ITooltipContentProps> = ({ items }) => {
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
