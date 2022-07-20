/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { ReactElement } from 'react';

import { Icon } from '../Icon';
import { useStyles } from './styles';
import { NoticeVariant } from './types';

interface NoticeProps {
  className?: string;
  title?: string | ReactElement;
  description: string | ReactElement;
  variant?: NoticeVariant;
}

const getNoticeIconName = (
  variant: NoticeVariant,
): 'info' | 'notice' | 'checkInline' | 'attention' => {
  switch (variant) {
    case 'error':
      return 'notice';
    case 'success':
      return 'checkInline';
    case 'warning':
      return 'attention';
    default:
    case 'info':
      return 'info';
  }
};

export const Notice = ({ className, title, description, variant = 'info' }: NoticeProps) => {
  const styles = useStyles();

  return (
    <div css={styles.root}>
      <Paper css={[styles.inner, styles.getInnerStyles({ variant })]} className={className}>
        <Icon
          css={[styles.icon, styles.getIconStyles({ variant })]}
          name={getNoticeIconName(variant)}
        />
        <div css={styles.content}>
          {title && (
            <Typography variant="small2" color="text.primary" css={styles.title}>
              {title}
            </Typography>
          )}
          <Typography
            variant="small2"
            color="text.primary"
            css={styles.getDescription({ hasMarginTop: !!title })}
          >
            {description}
          </Typography>
        </div>
      </Paper>
    </div>
  );
};

export const NoticeInfo = (props: NoticeProps) => <Notice variant="info" {...props} />;
export const NoticeError = (props: NoticeProps) => <Notice variant="error" {...props} />;
export const NoticeWarning = (props: NoticeProps) => <Notice variant="warning" {...props} />;
export const NoticeSuccess = (props: NoticeProps) => <Notice variant="success" {...props} />;
