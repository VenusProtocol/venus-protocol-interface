import React from 'react';
import { useTranslation } from 'translation';
import { cn } from 'utilities';

import spinnerAnimation from './spinnerAnimation.gif';
import TEST_IDS from './testIds';

interface SpinnerProps {
  variant?: 'large' | 'small';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ variant = 'large', className }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        variant === 'large' && 'h-full w-full',
        className,
      )}
      data-testid={TEST_IDS.spinner}
    >
      <img
        className={cn(variant === 'large' ? 'h-7 w-7' : 'h-5 w-5')}
        src={spinnerAnimation}
        alt={t('spinner.altText')}
      />
    </div>
  );
};
