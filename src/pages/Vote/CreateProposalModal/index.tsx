/** @jsxImportSource @emotion/react */
import React, { useCallback, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Modal,
  FormikSubmitButton,
  FormikTextField,
  FormikMarkdownEditor,
  PrimaryButton,
} from 'components';
import { useTranslation } from 'translation';
import ActionAccordion from './ActionAccordion';
import ProposalPreview from './ProposalPreview';
import proposalSchema, { FormValues, ErrorCode } from './proposalSchema';
import { useStyles } from './styles';

interface ICreateProposal {
  isOpen: boolean;
  handleClose: () => void;
  createProposal: (data: FormValues) => void;
}

export const CreateProposal: React.FC<ICreateProposal> = ({
  isOpen,
  handleClose,
  createProposal,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0);

  const steps = useMemo(
    () => [
      {
        title: t('vote.pages.proposalInformation'),
        Component: () => (
          <>
            <FormikTextField
              name="title"
              placeholder={t('vote.createProposalForm.name')}
              label={t('vote.createProposalForm.proposalName')}
              css={styles.formBottomMargin}
              displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
            />
            <FormikMarkdownEditor
              name="description"
              placeholder={t('vote.createProposalForm.addDescription')}
              label={t('vote.createProposalForm.description')}
              css={styles.sectionSpacing}
              displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
            />
          </>
        ),
      },
      {
        title: t('vote.pages.votingOptions'),
        Component: () => (
          <>
            <FormikTextField
              name="forDescription"
              placeholder={t('vote.createProposalForm.forOption')}
              label={t('vote.for')}
              css={styles.formBottomMargin}
              displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
            />
            <FormikTextField
              name="againstDescription"
              placeholder={t('vote.createProposalForm.againstOption')}
              label={t('vote.against')}
              css={styles.formBottomMargin}
              displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
            />
            <FormikTextField
              name="abstainDescription"
              placeholder={t('vote.createProposalForm.abstainOption')}
              label={t('vote.abstain')}
              css={styles.sectionSpacing}
              displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
            />
          </>
        ),
      },
      {
        title: t('vote.pages.actions'),
        Component: () => <ActionAccordion />,
      },
      {
        title: t('vote.pages.confirmation'),
        Component: () => <ProposalPreview />,
      },
    ],
    [],
  );

  const buttonText =
    currentStep === steps.length - 2
      ? t('vote.createProposalForm.confirm')
      : t('vote.createProposalForm.nextStep');

  const CurrentFields = steps[currentStep].Component;

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      handleBackAction={currentStep > 0 ? () => setCurrentStep(currentStep - 1) : undefined}
      title={steps[currentStep].title}
      css={styles.modal}
    >
      <Formik
        initialValues={{
          actions: [{ address: '', signature: '', callData: [] }],
          description: '',
          forDescription: '',
          againstDescription: '',
          abstainDescription: '',
          title: '',
        }}
        validationSchema={proposalSchema}
        onSubmit={createProposal}
        validateOnBlur
        validateOnMount
      >
        {({ errors }) => {
          const getErrorsByStep = useCallback(
            (step: number) => {
              switch (step) {
                case 0:
                  return !!(errors.title || errors.description);
                case 1:
                  return !!(
                    errors.forDescription ||
                    errors.abstainDescription ||
                    errors.againstDescription
                  );
                case 2:
                  return !!errors.actions;
                default:
                  return true;
              }
            },
            [currentStep, JSON.stringify(errors)],
          );
          return (
            <Form>
              <CurrentFields />
              {currentStep === steps.length - 1 ? (
                <FormikSubmitButton enabledLabel={t('vote.createProposalForm.create')} fullWidth />
              ) : (
                <PrimaryButton
                  fullWidth
                  disabled={getErrorsByStep(currentStep)}
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  {buttonText}
                </PrimaryButton>
              )}
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default CreateProposal;
