import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { cn } from '@venusprotocol/ui';
import { PrimaryButton } from 'components';
import { SwitchChain } from 'containers/SwitchChain';
import { useTranslation } from 'libs/translations';
import { ApproveDelegateSteps, type ApproveDelegateStepsProps } from '../../ApproveDelegateSteps';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  safeLimitTokens: string;
  fromTokenAmountTokens: string;
  approveDelegateAction: ApproveDelegateStepsProps['approveDelegateeAction'];
  isApproveDelegateLoading: ApproveDelegateStepsProps['isApproveDelegateeLoading'];
  isDelegateApproved: ApproveDelegateStepsProps['isDelegateeApproved'];
  isDelegateApprovedLoading: ApproveDelegateStepsProps['isDelegateeApprovedLoading'];
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  safeLimitTokens,
  fromTokenAmountTokens,
  approveDelegateAction,
  isApproveDelegateLoading,
  isDelegateApproved,
  isDelegateApprovedLoading,
}) => {
  const { t } = useTranslation();

  const isDangerous = useMemo(
    () => new BigNumber(fromTokenAmountTokens).isGreaterThan(safeLimitTokens),
    [fromTokenAmountTokens, safeLimitTokens],
  );

  const submitButtonLabel = useMemo(() => {
    if (!isFormValid) {
      return t('operationForm.submitButtonLabel.enterValidAmount');
    }

    return t('operationForm.submitButtonLabel.borrow');
  }, [isFormValid, t]);

  let dom = (
    <PrimaryButton
      type="submit"
      loading={isFormSubmitting}
      disabled={!isFormValid || isFormSubmitting}
      className={cn('w-full', isDangerous && 'border-red bg-red')}
    >
      {submitButtonLabel}
    </PrimaryButton>
  );

  if (isFormValid) {
    dom = (
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
