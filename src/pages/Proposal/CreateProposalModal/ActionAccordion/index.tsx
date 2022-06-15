/** @jsxImportSource @emotion/react */
import React from 'react';
import { FieldArray, FormikErrors } from 'formik';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Typography } from '@mui/material';
import { Icon, FormikTextField, SecondaryButton } from 'components';
import { useTranslation } from 'translation';
import { ErrorCode } from '../proposalSchema';
import CallDataFields from './CallDataFields';
import { useStyles } from './styles';

interface IActionAccordion {
  actions: { address: string; signature: string }[];
  errorsActions:
    | FormikErrors<{ address: string; signature: string; callData: string[] }>[]
    | undefined;
}

const ActionAccordion: React.FC<IActionAccordion> = ({ actions, errorsActions: errors }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [expandedIdx, setExpanded] = React.useState<number | undefined>(undefined);

  const handleChange =
    (actionIdx: number) => (event: React.SyntheticEvent, newExpandedIdx: boolean) => {
      setExpanded(newExpandedIdx ? actionIdx : undefined);
    };

  return (
    <div>
      <FieldArray
        name="actions"
        render={({ remove, push }) => (
          <>
            {actions.map((action, idx) => {
              const key = `action-item${idx}`;
              if (actions.length < 2) {
                return (
                  <>
                    <Typography color="textPrimary" css={styles.formBottomMargin}>
                      {t('vote.createProposalForm.action')}
                    </Typography>
                    <FormikTextField
                      name={`actions.${idx}.address`}
                      placeholder={t('vote.createProposalForm.address')}
                      maxLength={42}
                      css={styles.formBottomMargin}
                      displayableErrorCodes={[
                        ErrorCode.VALUE_REQUIRED,
                        ErrorCode.ACTION_ADDRESS_NOT_VALID,
                      ]}
                    />
                    <FormikTextField
                      name={`actions.${idx}.signature`}
                      placeholder={t('vote.createProposalForm.signature')}
                      displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
                    />
                    <CallDataFields signature={action.signature} actionIndex={idx} />
                  </>
                );
              }
              return (
                <Accordion
                  key={key}
                  expanded={expandedIdx === idx}
                  onChange={handleChange(idx)}
                  css={styles.accordionRoot}
                >
                  <AccordionSummary
                    aria-controls={`panel${idx}-content`}
                    id={`panel${idx}-header`}
                    css={styles.accordionSummary}
                  >
                    <div css={styles.accordionLeft}>
                      <Icon name="arrowDown" css={styles.arrow(expandedIdx === idx)} />
                      <Typography color="textPrimary">
                        {action.signature || t('vote.createProposalForm.action')}
                      </Typography>
                    </div>
                    <button onClick={() => remove(idx)} type="button" css={styles.iconButton}>
                      <Icon name="close" />
                    </button>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormikTextField
                      name={`actions.${idx}.address`}
                      placeholder={t('vote.createProposalForm.address')}
                      maxLength={42}
                      css={[styles.formTopMargin, styles.formBottomMargin]}
                      displayableErrorCodes={[
                        ErrorCode.ACTION_ADDRESS_NOT_VALID,
                        ErrorCode.VALUE_REQUIRED,
                      ]}
                    />
                    <FormikTextField
                      name={`actions.${idx}.signature`}
                      placeholder={t('vote.createProposalForm.signature')}
                      displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
                    />
                    <CallDataFields signature={action.signature} actionIndex={idx} />
                  </AccordionDetails>
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
