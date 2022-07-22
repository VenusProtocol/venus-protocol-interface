/** @jsxImportSource @emotion/react */
import React from 'react';

import { Spinner as SpinnerAnimation } from '../LottieAnimation';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface SpinnerProps {
  variant?: 'large' | 'small';
  autoplay?: boolean;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  variant = 'large',
  autoplay = true,
  className,
}) => {
  const styles = useStyles({ variant });
  return (
    <div css={styles.container} className={className} data-testid={TEST_IDS.spinner}>
      <SpinnerAnimation autoplay={autoplay} css={styles.spinner} />
    </div>
  );
};
