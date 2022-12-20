/** @jsxImportSource @emotion/react */
import {
  FormikMarkdownEditor,
  FormikSelectField,
  FormikSubmitButton,
  FormikTextField,
  Modal,
  PrimaryButton,
  toast,
} from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { ProposalTypeName } from 'types';
import type { TransactionReceipt } from 'web3-core';

import { CreateProposalInput } from 'clients/api';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import formatProposalPayload from 'pages/Vote/CreateProposalModal/formatProposalPayload';

import ActionAccordion from './ActionAccordion';
import ProposalPreview from './ProposalPreview';
import proposalSchema, { ErrorCode, FormValues } from './proposalSchema';
import { useStyles } from './styles';

interface CreateProposalProps {
  isOpen: boolean;
  handleClose: () => void;
  createProposal: (
    data: Omit<CreateProposalInput, 'accountAddress'>,
  ) => Promise<TransactionReceipt>;
  isCreateProposalLoading: boolean;
}

export const CreateProposal: React.FC<CreateProposalProps> = ({
  isOpen,
  handleClose,
  createProposal,
  isCreateProposalLoading,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const [currentStep, setCurrentStep] = useState(0);

  const steps = useMemo(
    () => [
      {
        title: t('vote.pages.proposalInformation'),
        Component: () => (
          <>
            <FormikSelectField
              name="proposalType"
              title={t('vote.createProposalForm.proposalType')}
              ariaLabel={t('vote.createProposalForm.proposalType')}
              css={styles.formBottomMargin}
              options={[
                { value: ProposalTypeName.NORMAL, label: t('vote.proposalType.normal') },
                { value: ProposalTypeName.FAST_TRACK, label: t('vote.proposalType.fastTrack') },
                { value: ProposalTypeName.CRITICAL, label: t('vote.proposalType.critical') },
              ]}
            />
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

  const handleCreateProposal = async (formValues: FormValues) => {
    try {
      const payload = formatProposalPayload(formValues);
      const transactionReceipt = await createProposal(payload);

      handleClose();

      openSuccessfulTransactionModal({
        title: t('vote.yourProposalwasCreatedSuccessfully'),
        content: t('vote.pleaseAllowTimeForConfirmation'),
        transactionHash: transactionReceipt.transactionHash,
      });
    } catch (error) {
      let { message } = error as Error;

      if (error instanceof VError) {
        message = formatVErrorToReadableString(error);
      }

      toast.error({ message });
    }
  };

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
          actions: [{ target: '', signature: '', callData: [] }],
          description: '',
          forDescription: '',
          againstDescription: '',
          abstainDescription: '',
          title: '',
          proposalType: ProposalTypeName.NORMAL,
        }}
        validationSchema={proposalSchema}
        onSubmit={handleCreateProposal}
        validateOnBlur
        validateOnMount
        isInitialValid={false}
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
                <FormikSubmitButton
                  enabledLabel={t('vote.createProposalForm.create')}
                  fullWidth
                  loading={isCreateProposalLoading}
                />
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
