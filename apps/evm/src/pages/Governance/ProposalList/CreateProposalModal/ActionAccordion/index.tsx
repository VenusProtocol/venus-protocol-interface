/** @jsxImportSource @emotion/react */
import { FieldArray, useField } from 'formik';
import { useState } from 'react';

import { Icon, SecondaryButton } from 'components';
import { useTranslation } from 'libs/translations';

import { FormikTextField } from 'containers/Form';
import { parseFunctionSignature } from 'utilities';
import { ErrorCode, initialActionData } from '../proposalSchema';
import { Accordion } from './Accordion';
import CallDataFields from './CallDataFields';
import { useStyles } from './styles';

const ActionAccordion: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [expandedIdx, setExpanded] = useState<number | undefined>(0);

  const [{ value: actions }, { error: errors }, { setValue }] =
    useField<{ target: string; signature: string; callData: string[] }[]>('actions');

  const handleBlurSignature: React.FocusEventHandler<HTMLInputElement> = () => {
    if (expandedIdx === undefined) {
      return;
    }

    const action = actions[expandedIdx];
    const signature = parseFunctionSignature(action.signature);
    const inputsCount = signature?.inputs.length ?? 0;

    // Remove extra inputs
    if (inputsCount < action.callData.length) {
      const updatedActions = actions.map((action, index) => ({
        ...action,
        callData: index === expandedIdx ? action.callData.slice(0, inputsCount) : action.callData,
      }));

      setValue(updatedActions);
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
                      <button
                        onClick={() => remove(idx)}
                        type="button"
                        css={styles.iconButton}
                        className="cursor-pointer"
                      >
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
