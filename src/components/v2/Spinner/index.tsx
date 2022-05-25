/** @jsxImportSource @emotion/react */
import React from 'react';
import { Spinner as SpinnerAnimation } from '../LottieAnimation';
import { useStyles } from './styles';

interface ISpinnerProps {
  variant?: 'large' | 'small';
  autoplay?: boolean;
  className?: string;
}

export const Spinner: React.FC<ISpinnerProps> = ({
  variant = 'large',
  autoplay = true,
  className,
}) => {
  const styles = useStyles({ variant });
  return (
    <div css={styles.container}>
      <SpinnerAnimation className={className} autoplay={autoplay} css={styles.spinner} />
    </div>
  );
};
