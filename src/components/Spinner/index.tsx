/** @jsxImportSource @emotion/react */
import React from 'react';

import { Spinner as SpinnerAnimation } from '../LottieAnimation';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface SpinnerProps {
  variant?: 'large' | 'small';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ variant = 'large', className }) => {
  const styles = useStyles({ variant });

  return (
    <div css={styles.container} className={className} data-testid={TEST_IDS.spinner}>
      <SpinnerAnimation css={styles.spinner} />
    </div>
  );
};
