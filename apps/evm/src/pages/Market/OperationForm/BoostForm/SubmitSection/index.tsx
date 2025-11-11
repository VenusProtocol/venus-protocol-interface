import { useMemo } from 'react';

import { PrimaryButton } from 'components';
import { SwitchChain } from 'containers/SwitchChain';
import { useTranslation } from 'libs/translations';
import type { FormErrorCode } from '../useForm';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  formErrorCode?: FormErrorCode;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  formErrorCode,
}) => {
  const { t } = useTranslation();

  const submitButtonLabel = useMemo(() => {
    if (!isFormValid && formErrorCode !== 'REQUIRES_RISK_ACKNOWLEDGEMENT') {
      return t('operationForm.submitButtonLabel.enterValidAmount');
    }

    return t('operationForm.submitButtonLabel.boost');
  }, [isFormValid, t, formErrorCode]);

  let dom = (
    <PrimaryButton
      type="submit"
      loading={isFormSubmitting}
      disabled={!isFormValid || isFormSubmitting}
      className="w-full"
    >
      {submitButtonLabel}
    </PrimaryButton>
  );

  if (isFormValid) {
    dom = <SwitchChain>{dom}</SwitchChain>;
  }

  return dom;
};

export default SubmitSection;
