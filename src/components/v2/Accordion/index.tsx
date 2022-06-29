/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Icon } from '../Icon';

import { useStyles } from './styles';

export interface IAccordionProps {
  className?: string;
  expanded: boolean;
  onChange: (index: number | undefined) => void;
  id: number;
  title: string;
  leftAction?: React.ReactElement;
}

export const Accordion: React.FC<IAccordionProps> = ({
  className,
  expanded,
  onChange,
  id,
  title,
  leftAction,
  children,
}) => {
  const styles = useStyles();

  const handleChange =
    (actionIdx: number) => (event: React.SyntheticEvent, newExpandedIdx: boolean) => {
      onChange(newExpandedIdx ? actionIdx : undefined);
    };
  return (
    <MuiAccordion
      className={className}
      expanded={expanded}
      onChange={handleChange(id)}
      css={styles.accordionRoot}
    >
      <AccordionSummary
        aria-controls={`panel${id}-content`}
        id={`panel${id}-header`}
        css={styles.accordionSummary}
      >
        <div css={styles.accordionLeft}>
          <Icon name="arrowDown" css={styles.arrow(expanded)} />
          <Typography color={expanded ? 'textPrimary' : 'textSecondary'}>{title}</Typography>
        </div>
        {leftAction || <div />}
      </AccordionSummary>
      <AccordionDetails css={styles.content}>{children}</AccordionDetails>
    </MuiAccordion>
  );
};
