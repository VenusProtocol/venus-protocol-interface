import { useMemo } from 'react';
import { Control, useFormState } from 'react-hook-form';

import { PrimaryButton } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

import { FormValues } from '../../types';

export interface SubmitSectionProps {
  control: Control<FormValues>;
  isDangerous: boolean;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({ control, isDangerous }) => {
  const { t } = useTranslation();

  const formState = useFormState({ control });

  const label = useMemo(() => {
    if (!formState.isValid) {
      return t('vai.borrow.submitButton.enterValidAmountLabel');
    }

    return t('vai.borrow.submitButton.borrowLabel');
  }, [formState.isValid, t]);

  return (
    <ConnectWallet buttonVariant="primary">
      <PrimaryButton
        type="submit"
        loading={formState.isSubmitting}
        disabled={!formState.isValid || formState.isSubmitting}
        className={cn('w-full', isDangerous && 'bg-red')}
      >
        {label}
      </PrimaryButton>
    </ConnectWallet>
  );
};

export default SubmitSection;
