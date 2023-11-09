/** @jsxImportSource @emotion/react */
import { Modal } from 'components';
import { displayMutationError } from 'errors';
import { Form, Formik, useFormikContext } from 'formik';
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'translation';
import { ProposalType } from 'types';

import { CreateProposalInput } from 'clients/api';
import { routes } from 'constants/routing';
import formatProposalPayload from 'pages/Governance/ProposalList/CreateProposalModal/formatProposalPayload';

import ProposalWizard, {
  ProposalWizardSteps,
  getCurrentStep,
  getPreviousStep,
} from './ProposalWizard';
import checkImportErrors from './checkImportErrors';
import importJsonProposal from './importJsonProposal';
import proposalSchema, { FormValues, initialActionData } from './proposalSchema';
import { useStyles } from './styles';

interface CreateProposalProps {
  isOpen: boolean;
  handleClose: () => void;
  createProposal: (data: Omit<CreateProposalInput, 'accountAddress'>) => Promise<unknown>;
  isCreateProposalLoading: boolean;
}

export type ProposalFormContext = ReturnType<typeof useFormikContext<FormValues>>;

export const CreateProposal: React.FC<CreateProposalProps> = ({
  isOpen,
  handleClose,
  createProposal,
  isCreateProposalLoading,
}) => {
  const newProposalStep = useParams()['*'];

  const matchProposalInfoStep = newProposalStep === 'proposal-info';
  const matchProposalDescriptionsStep = newProposalStep === 'proposal-descriptions';
  const matchProposalActionsStep = newProposalStep === 'proposal-actions';
  const matchProposalPreviewStep = newProposalStep === 'proposal-preview';
  const currentStep = getCurrentStep({
    matchProposalInfoStep,
    matchProposalDescriptionsStep,
    matchProposalActionsStep,
    matchProposalPreviewStep,
  });

  const navigate = useNavigate();
  const styles = useStyles();
  const { t } = useTranslation();
  const [proposalMode, setProposalMode] = useState<'file' | 'manual'>('manual');

  const handleImportProposal = async (file: File | null, formikContext: ProposalFormContext) => {
    const { setValues, validateForm } = formikContext;
    if (file) {
      try {
        const values = await importJsonProposal(file);
        await setValues(values);

        const errors = await validateForm(values);
        checkImportErrors(errors);

        setProposalMode('file');
        navigate(routes.governanceProposalPreview.path);
      } catch (error) {
        displayMutationError({ error });
      }
    }
  };

  const titles = useMemo(() => {
    const initialSteps: { [Key in ProposalWizardSteps]?: string } = {
      'proposal-create': t('vote.createProposalModal.createProposal'),
    };

    if (proposalMode === 'file') {
      return {
        ...initialSteps,
        'proposal-preview': t('vote.pages.confirmation'),
      };
    }

    return {
      ...initialSteps,
      'proposal-info': t('vote.pages.proposalInformation'),
      'proposal-descriptions': t('vote.pages.votingOptions'),
      'proposal-actions': t('vote.pages.actions'),
      'proposal-preview': t('vote.pages.confirmation'),
    };
  }, [proposalMode]);

  const handleBackAction = () => {
    const previousStep = getPreviousStep(currentStep, proposalMode);
    navigate(`${routes.governance.path}/${previousStep}`);
  };

  const handleCreateProposal = async (formValues: FormValues) => {
    try {
      const payload = formatProposalPayload(formValues);
      await createProposal(payload);

      handleClose();
    } catch (error) {
      displayMutationError({ error });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      handleBackAction={currentStep !== 'proposal-create' ? handleBackAction : undefined}
      title={titles[currentStep]}
      css={styles.modal}
    >
      <Formik
        initialValues={{
          actions: [initialActionData],
          description: '',
          forDescription: '',
          againstDescription: '',
          abstainDescription: '',
          title: '',
          proposalType: ProposalType.NORMAL,
        }}
        validationSchema={proposalSchema}
        onSubmit={handleCreateProposal}
        validateOnBlur
        validateOnMount
      >
        <Form>
          <ProposalWizard
            handleImportProposal={handleImportProposal}
            setProposalMode={setProposalMode}
            isCreateProposalLoading={isCreateProposalLoading}
            currentStep={currentStep}
          />
        </Form>
      </Formik>
    </Modal>
  );
};

export default CreateProposal;
