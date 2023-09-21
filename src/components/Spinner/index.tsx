/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTranslation } from 'translation';

import spinnerAnimation from './spinnerAnimation.gif';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface SpinnerProps {
  variant?: 'large' | 'small';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ variant = 'large', className }) => {
  const styles = useStyles({ variant });
  const { t } = useTranslation();

  return (
    <div css={styles.container} className={className} data-testid={TEST_IDS.spinner}>
      <img css={styles.spinner} src={spinnerAnimation} alt={t('spinner.altText')} />
    </div>
  );
};
