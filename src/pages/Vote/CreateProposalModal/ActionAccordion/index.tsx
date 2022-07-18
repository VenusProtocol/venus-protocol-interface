/** @jsxImportSource @emotion/react */
import { Accordion, FormikTextField, Icon, SecondaryButton } from 'components';
import { ethers } from 'ethers';
import { FieldArray, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'translation';

import { ErrorCode } from '../proposalSchema';
import CallDataFields from './CallDataFields';
import { useStyles } from './styles';

const ActionAccordion: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [expandedIdx, setExpanded] = React.useState<number | undefined>(0);

  const [{ value: actions }, { error: errors }, { setValue }] =
    useField<{ target: string; signature: string; data: string[] }[]>('actions');

  const handleBlurSignature: React.FocusEventHandler<HTMLInputElement> = () => {
    const actionsCopy = [...actions];
    if (expandedIdx !== undefined) {
      const actionCopy = actionsCopy[expandedIdx];
      const { signature, data } = actionCopy;
      // When we blur the signature, clean up extra fields
      if (data) {
        try {
          const fragment = ethers.utils.FunctionFragment.from(signature || '');
          const numberOfInputs = fragment.inputs.length;
          actionsCopy[expandedIdx].data = data.slice(0, numberOfInputs);
          setValue(actionsCopy);
        } catch (err) {
          // eslint-disable-next-line no-console
        }
      }
    }
  };

  return (
    <div>
      <FieldArray
        name="actions"
        render={({ remove, push }) => (
          <>
            {actions.map((action, idx) => {
              const key = `action-item${idx}`;
              return (
                <Accordion
                  key={key}
                  id={idx}
                  expanded={expandedIdx === idx}
                  onChange={setExpanded}
                  title={action.signature || t('vote.createProposalForm.action')}
                  rightAdornment={
                    idx === 0 ? undefined : (
                      <button onClick={() => remove(idx)} type="button" css={styles.iconButton}>
                        <Icon name="close" css={styles.closeIcon} />
                      </button>
                    )
                  }
                  css={styles.accordion}
                >
                  <FormikTextField
                    name={`actions.${idx}.target`}
                    data-testid={`actions.${idx}.address`}
                    placeholder={t('vote.createProposalForm.address')}
                    maxLength={42}
                    css={[styles.formTopMargin, styles.formBottomMargin]}
                    displayableErrorCodes={[
                      ErrorCode.ACTION_ADDRESS_NOT_VALID,
                      ErrorCode.VALUE_REQUIRED,
                    ]}
                    label={t('vote.createProposalForm.address')}
                  />
                  <FormikTextField
                    name={`actions.${idx}.signature`}
                    data-testid={`actions.${idx}.signature`}
                    placeholder={t('vote.createProposalForm.signature')}
                    displayableErrorCodes={[
                      ErrorCode.VALUE_REQUIRED,
                      ErrorCode.SIGNATURE_NOT_VALID,
                    ]}
                    label={t('vote.createProposalForm.signature')}
                    onBlur={handleBlurSignature}
                  />
                  <CallDataFields signature={action.signature} actionIndex={idx} />
                </Accordion>
              );
            })}
            <SecondaryButton
              onClick={() => {
                push({ address: '', signature: '' });
                setExpanded(actions.length || 0);
              }}
              fullWidth
              css={styles.addOneMore}
              disabled={!!errors || actions.length === 10}
            >
              {t('vote.createProposalForm.addOneMoreAction')}
            </SecondaryButton>
          </>
        )}
      />
    </div>
  );
};

export default ActionAccordion;
