/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import { IProgressBarProps, ProgressBar } from '..';
import { useStyles } from './styles';

interface ILabeledProgressBar extends IProgressBarProps {
  greyLeftText?: string;
  whiteLeftText?: string | React.ReactElement;
  greyRightText?: string;
  whiteRightText?: string;
  className?: string;
}

export const LabeledProgressBar: React.FC<ILabeledProgressBar> = ({
  greyRightText,
  whiteRightText,
  greyLeftText,
  whiteLeftText,
  className,
  ...progressBarProps
}) => {
  const styles = useStyles();
  return (
    <>
      <div className={className} css={styles.topProgressBarLegend}>
        <div css={styles.inlineContainer}>
          {greyLeftText && (
            <Typography component="span" variant="small2" css={styles.inlineLabel}>
              {greyLeftText}
            </Typography>
          )}
          {whiteLeftText && (
            <Typography component="span" variant="small1" css={styles.inlineValue}>
              {whiteLeftText}
            </Typography>
          )}
        </div>

        <div css={styles.inlineContainer}>
          {greyRightText && (
            <Typography component="span" variant="small2" css={styles.inlineLabel}>
              {greyRightText}
            </Typography>
          )}

          {whiteRightText && (
            <Typography component="span" variant="small1" css={styles.inlineValue}>
              {whiteRightText}
            </Typography>
          )}
        </div>
      </div>
      <ProgressBar {...progressBarProps} />
    </>
  );
};
