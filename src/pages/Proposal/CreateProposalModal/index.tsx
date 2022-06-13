/** @jsxImportSource @emotion/react */
import React from 'react';
import { Formik, Form, FormikErrors } from 'formik';
import { Modal, FormikSubmitButton, FormikTextField } from 'components';
import { useTranslation } from 'translation';
import ActionAccordion from './ActionAccordion';
import proposalSchema from './proposalSchema';
import { useStyles } from './styles';

interface ICreateProposal {
  isOpen: boolean;
  handleClose: () => void;
  createProposal: () => void;
}

export const CreateProposal: React.FC<ICreateProposal> = ({
  isOpen,
  handleClose,
  createProposal,
}) => {
  const styles = useStyles();

  const { t } = useTranslation();
  return (
    <Modal
      isOpened={isOpen}
      handleClose={handleClose}
      title={t('vote.createProposal')}
      css={styles.modal}
    >
      <Formik
        initialValues={{ actions: [{ address: '', signature: '' }], description: '' }}
        validationSchema={proposalSchema}
        onSubmit={createProposal}
        validateOnChange
      >
        {({ values: { actions }, errors, touched }) => (
          <Form>
            <ActionAccordion
              actions={actions}
              touchedActions={touched.actions}
              errorsActions={
                errors.actions as FormikErrors<{ address: string; signature: string }>[] | undefined
              }
            />
            <FormikTextField
              name="description"
              placeholder={t('vote.createProposalForm.addDescription')}
              css={styles.sectionSpacing}
              hasError={!!errors.description && touched.description}
            />
            <FormikSubmitButton enabledLabel={t('vote.createProposalForm.create')} fullWidth />
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateProposal;
