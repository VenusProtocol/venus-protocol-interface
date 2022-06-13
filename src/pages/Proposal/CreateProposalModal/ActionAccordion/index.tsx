/** @jsxImportSource @emotion/react */
import React from 'react';
import { FieldArray, FormikErrors, FormikTouched } from 'formik';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Typography } from '@mui/material';
import { Icon, FormikTextField, SecondaryButton } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from './styles';

interface IActionAccordion {
  actions: { address: string; signature: string }[];
  errorsActions: FormikErrors<{ address: string; signature: string }>[] | undefined;
  touchedActions: FormikTouched<{ address: boolean; signature: boolean }>[] | undefined;
}

const ActionAccordion: React.FC<IActionAccordion> = ({
  actions,
  errorsActions: errors,
  touchedActions: touched,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [expandedIdx, setExpanded] = React.useState<number | undefined>(undefined);

  const handleChange =
    (actionIdx: number) => (event: React.SyntheticEvent, newExpandedIdx: boolean) => {
      setExpanded(newExpandedIdx ? actionIdx : undefined);
    };
  console.log({ errors, actions });

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
                    <Typography>{t('vote.createProposalForm.action')}</Typography>
                    <FormikTextField
                      name="actions.0.address"
                      placeholder={t('vote.createProposalForm.address')}
                      maxLength={42}
                      css={styles.formBottomMargin}
                      hasError={
                        !!(errors && errors[idx]?.address) && touched && touched[idx]?.address
                      }
                    />
                    <FormikTextField
                      name="actions.0.signature"
                      placeholder={t('vote.createProposalForm.signature')}
                      hasError={
                        !!(errors && errors[idx]?.signature) && touched && touched[idx]?.signature
                      }
                    />
                  </>
                );
              }
              return (
                <Accordion key={key} expanded={expandedIdx === idx} onChange={handleChange(idx)}>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    {expandedIdx === idx ? (
                      <Icon name="arrowDown" css={styles.invertArrow} />
                    ) : (
                      <Icon name="arrowDown" />
                    )}
                    <Typography>{action.signature}</Typography>
                    <button onClick={() => remove(idx)} type="button">
                      <Icon name="close" />
                    </button>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{t('vote.createProposalForm.action')}</Typography>
                    <FormikTextField
                      name={`actions.${idx}.address`}
                      placeholder={t('vote.createProposalForm.address')}
                      maxLength={42}
                      css={[styles.formTopMargin, styles.formBottomMargin]}
                      hasError={
                        !!(errors && errors[idx]?.address) && touched && touched[idx]?.address
                      }
                    />
                    <FormikTextField
                      name={`actions.${idx}.signature`}
                      placeholder={t('vote.createProposalForm.signature')}
                      hasError={
                        !!(errors && errors[idx]?.signature) && touched && touched[idx]?.signature
                      }
                    />
                  </AccordionDetails>
                </Accordion>
              );
            })}
            <SecondaryButton
              onClick={() => {
                push({});
                setExpanded((expandedIdx || 0) + 1);
              }}
              fullWidth
              disabled={!!errors}
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
