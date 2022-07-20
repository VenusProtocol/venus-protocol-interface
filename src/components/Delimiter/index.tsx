/** @jsxImportSource @emotion/react */
import React from 'react';

import { useDelimiterStyles as useStyles } from './styles';

interface DelimiterProps {
  className?: string;
}

export const Delimiter = ({ className }: DelimiterProps) => {
  const styles = useStyles();
  return <hr css={styles.root} className={className} />;
};
