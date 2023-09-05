/** @jsxImportSource @emotion/react */
import { FormikSubmitButton, PrimaryButton } from 'components';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useTranslation } from 'translation';

import { routes } from 'constants/routing';

import ActionAccordion from '../ActionAccordion';
import ProposalInfo from '../ProposalInfo';
import ProposalPreview from '../ProposalPreview';
import UploadOrManualProposal from '../UploadOrManualProposal';
import VotingDescriptions from '../VotingDescriptions';
import { FormValues } from '../proposalSchema';

export type ProposalFormContext = ReturnType<typeof useFormikContext<FormValues>>;

export type ProposalWizardSteps =
  | 'proposal-create'
  | 'proposal-info'
  | 'proposal-descriptions'
  | 'proposal-actions'
  | 'proposal-preview';

interface ProposalWizardProps {
  setProposalMode: (mode: 'file' | 'manual') => void;
  handleImportProposal: (file: File | null, formikContext: ProposalFormContext) => Promise<void>;
  isCreateProposalLoading: boolean;
  currentStep: ProposalWizardSteps;
}

export const getCurrentStep = ({
  matchProposalInfoStep,
  matchProposalDescriptionsStep,
  matchProposalActionsStep,
  matchProposalPreviewStep,
}: {
  matchProposalInfoStep: boolean;
  matchProposalDescriptionsStep: boolean;
  matchProposalActionsStep: boolean;
  matchProposalPreviewStep: boolean;
}): ProposalWizardSteps => {
  if (matchProposalInfoStep) {
    return 'proposal-info';
  }
  if (matchProposalDescriptionsStep) {
    return 'proposal-descriptions';
  }
  if (matchProposalActionsStep) {
    return 'proposal-actions';
  }
  if (matchProposalPreviewStep) {
    return 'proposal-preview';
  }

  return 'proposal-create';
};

export const getPreviousStep = (
  currentStep: ProposalWizardSteps,
  proposalMode: 'file' | 'manual',
): ProposalWizardSteps => {
  switch (currentStep) {
    case 'proposal-preview':
      return proposalMode === 'manual' ? 'proposal-actions' : 'proposal-create';
    case 'proposal-actions':
      return 'proposal-descriptions';
    case 'proposal-descriptions':
      return 'proposal-info';
    default:
      return 'proposal-create';
  }
};

const getNextStep = (currentStep: ProposalWizardSteps): ProposalWizardSteps => {
  switch (currentStep) {
    case 'proposal-info':
      return 'proposal-descriptions';
    case 'proposal-descriptions':
      return 'proposal-actions';
    default:
      return 'proposal-preview';
  }
};

const ProposalWizard: React.FC<ProposalWizardProps> = ({
  setProposalMode,
  handleImportProposal,
  isCreateProposalLoading,
  currentStep,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  const formikContext = useFormikContext<FormValues>();
  const { errors } = formikContext;

  const getErrorsByStep = useCallback(
    (step: ProposalWizardSteps) => {
      switch (step) {
        case 'proposal-info':
          return !!(errors.title || errors.description);
        case 'proposal-descriptions':
          return !!(
            errors.forDescription ||
            errors.abstainDescription ||
            errors.againstDescription
          );
        case 'proposal-actions':
          return !!errors.actions;
        default:
          return true;
      }
    },
    [currentStep, JSON.stringify(errors)],
  );

  const buttonText =
    currentStep === 'proposal-preview'
      ? t('vote.createProposalForm.confirm')
      : t('vote.createProposalForm.nextStep');

  const handleClickCreateManually = () => {
    setProposalMode('manual');
    history.push(routes.governanceProposalInfo.path);
  };

  const handleClickUploadFile = async (file: File | null) => {
    handleImportProposal(file, formikContext);
  };

  return (
    <>
      <Switch>
        <Route path={routes.governanceProposalCreate.path}>
          <UploadOrManualProposal
            onClickCreateManually={handleClickCreateManually}
            onClickUploadFile={handleClickUploadFile}
          />
        </Route>
        <Route path={routes.governanceProposalInfo.path}>
          <ProposalInfo />
        </Route>
        <Route path={routes.governanceProposalDescriptions.path}>
          <VotingDescriptions />
        </Route>
        <Route path={routes.governanceProposalActions.path}>
          <ActionAccordion />
        </Route>
        <Route path={routes.governanceProposalPreview.path}>
          <ProposalPreview />
        </Route>
      </Switch>

      {currentStep !== 'proposal-create' && currentStep !== 'proposal-preview' && (
        <PrimaryButton
          fullWidth
          disabled={getErrorsByStep(currentStep)}
          onClick={() => {
            const nextStep = getNextStep(currentStep);
            history.push(`${routes.governance.path}/${nextStep}`);
          }}
        >
          {buttonText}
        </PrimaryButton>
      )}

      {currentStep === 'proposal-preview' && (
        <FormikSubmitButton
          enabledLabel={t('vote.createProposalForm.create')}
          fullWidth
          loading={isCreateProposalLoading}
        />
      )}
    </>
  );
};

export default ProposalWizard;
