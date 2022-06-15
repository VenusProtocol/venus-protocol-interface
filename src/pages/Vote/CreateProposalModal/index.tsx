/** @jsxImportSource @emotion/react */
import React from 'react';
import { Formik, Form, FormikErrors } from 'formik';
import { Modal, FormikSubmitButton, FormikTextField, MarkdownEditor } from 'components';
import { useTranslation } from 'translation';
import ActionAccordion from './ActionAccordion';
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
  return (
    <Modal
      isOpened={isOpen}
      handleClose={handleClose}
      title={t('vote.createProposal')}
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
        // @todo validate form inputs
        onSubmit={createProposal}
        validateOnChange
        validateOnMount
      >
        {({
          values: { actions, description },
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
        }) => (
          <Form>
            <FormikTextField
              name="title"
              placeholder={t('vote.createProposalForm.title')}
              css={styles.formBottomMargin}
              displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
            />
            <ActionAccordion
              actions={actions}
              errorsActions={
                errors.actions as FormikErrors<{ address: string; signature: string }>[] | undefined
              }
            />
            <MarkdownEditor
              name="description"
              placeholder={t('vote.createProposalForm.addDescription')}
              css={styles.sectionSpacing}
              hasError={!!errors.description && touched.description}
              onChange={(value: string | undefined) => {
                setFieldTouched('description', true);
                setFieldValue('description', value);
              }}
              value={description}
            />
            <FormikSubmitButton enabledLabel={t('vote.createProposalForm.create')} fullWidth />
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateProposal;
