/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React from 'react';

import { useStyles } from './styles';

export interface SectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, className, children }) => {
  const styles = useStyles();

  return (
    <div className={className}>
      {!!title && (
        <Typography css={styles.title} variant="h3">
          {title}
        </Typography>
      )}

      {children}
    </div>
  );
};

export default Section;
