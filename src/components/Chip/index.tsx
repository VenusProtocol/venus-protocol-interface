/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';
import { useStyles } from './styles';

interface IChipProps {
  className?: string;
  text: string;
  backgroundColor?: string;
  textColor?: string;
}

export const Chip = ({ className, text, backgroundColor, textColor }: IChipProps) => {
  const styles = useStyles();
  return (
    <div className={className} css={styles.root({ backgroundColor, textColor })}>
      <Typography variant="small2" color="textPrimary">
        {text}
      </Typography>
    </div>
  );
};

export const ActiveChip: React.FC<IChipProps> = ({ text, ...props }) => {
  const styles = useStyles();
  return (
    <Chip
      text={text}
      textColor={styles.active.textColor}
      backgroundColor={styles.active.backgroundColor}
      {...props}
    />
  );
};
