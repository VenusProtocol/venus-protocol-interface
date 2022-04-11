/** @jsxImportSource @emotion/react */
import React from 'react';

import { useDelimiterStyles as useStyles } from './styles';

interface IDelimiterProps {
  className?: string;
}

export const Delimiter = ({ className }: IDelimiterProps) => {
  const styles = useStyles();
  return <hr css={styles.root} className={className} />;
};
