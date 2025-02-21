import { useMemo } from 'react';

import { PrimaryButton } from 'components';
import { SwitchChain } from 'containers/SwitchChain';
import { useTranslation } from 'libs/translations';
import { ApproveDelegateSteps, type ApproveDelegateStepsProps } from '../../ApproveDelegateSteps';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  approveDelegateAction: ApproveDelegateStepsProps['approveDelegateeAction'];
  isApproveDelegateLoading: ApproveDelegateStepsProps['isApproveDelegateeLoading'];
  isDelegateApproved: ApproveDelegateStepsProps['isDelegateeApproved'];
  isDelegateApprovedLoading: ApproveDelegateStepsProps['isDelegateeApprovedLoading'];
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  approveDelegateAction,
  isApproveDelegateLoading,
  isDelegateApproved,
  isDelegateApprovedLoading,
}) => {
  const { t } = useTranslation();

  const submitButtonLabel = useMemo(() => {
    if (!isFormValid) {
      return t('operationForm.submitButtonLabel.enterValidAmount');
    }

    return t('operationForm.submitButtonLabel.withdraw');
  }, [isFormValid, t]);

  const dom = (
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
    return (
      <SwitchChain>
        <ApproveDelegateSteps
          approveDelegateeAction={approveDelegateAction}
          isApproveDelegateeLoading={isApproveDelegateLoading}
          isDelegateeApproved={isDelegateApproved}
          isDelegateeApprovedLoading={isDelegateApprovedLoading}
          secondStepButtonLabel={submitButtonLabel}
        >
          {dom}
        </ApproveDelegateSteps>
      </SwitchChain>
    );
  }

  return dom;
};

export default SubmitSection;
