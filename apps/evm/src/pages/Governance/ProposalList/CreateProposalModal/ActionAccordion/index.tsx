/** @jsxImportSource @emotion/react */
import { ethers } from 'ethers';
import { FieldArray, useField } from 'formik';
import { useState } from 'react';

import { Accordion, FormikTextField, Icon, SecondaryButton } from 'components';
import { useTranslation } from 'libs/translations';

import { ErrorCode, initialActionData } from '../proposalSchema';
import CallDataFields from './CallDataFields';
import { useStyles } from './styles';

const ActionAccordion: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [expandedIdx, setExpanded] = useState<number | undefined>(0);

  const [{ value: actions }, { error: errors }, { setValue }] =
    useField<{ target: string; signature: string; callData: string[] }[]>('actions');

  const handleBlurSignature: React.FocusEventHandler<HTMLInputElement> = () => {
    const actionsCopy = [...actions];

    if (expandedIdx !== undefined) {
      const actionCopy = actionsCopy[expandedIdx];
      const { signature, callData } = actionCopy;

      // When we blur the signature, clean up extra fields
      if (callData) {
        try {
          const fragment = ethers.utils.FunctionFragment.from(signature || '');
          const numberOfInputs = fragment.inputs.length;
          actionsCopy[expandedIdx].callData = callData.slice(0, numberOfInputs);
          setValue(actionsCopy);
        } catch {}
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
                        <Icon name="closeRounded" css={styles.closeIcon} />
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
                push(initialActionData);
                setExpanded(actions.length || 0);
              }}
              className="w-full"
              css={styles.addOneMore}
              disabled={!!errors || actions.length >= 30}
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
