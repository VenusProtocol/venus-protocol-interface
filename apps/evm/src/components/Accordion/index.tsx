/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface AccordionProps {
  className?: string;
  expanded: boolean;
  onChange: (index: number | undefined) => void;
  id: number;
  title: string;
  rightAdornment?: React.ReactElement;
  children?: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  className,
  expanded,
  onChange,
  id,
  title,
  rightAdornment,
  children,
}) => {
  const styles = useStyles();

  const handleChange =
    (actionIdx: number) => (_event: React.SyntheticEvent, newExpandedIdx: boolean) => {
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
          <Icon name="arrowUp" css={styles.arrow(expanded)} className="w-5 h-5" />
          <Typography color={expanded ? 'textPrimary' : 'textSecondary'}>{title}</Typography>
        </div>
        {rightAdornment || <div />}
      </AccordionSummary>
      <AccordionDetails css={styles.content}>{children}</AccordionDetails>
    </MuiAccordion>
  );
};
