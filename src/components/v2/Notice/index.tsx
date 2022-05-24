/** @jsxImportSource @emotion/react */
import React, { ReactElement } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Icon } from '../Icon';
import { NoticeVariant } from './types';
import { useStyles } from './styles';

interface INoticeProps {
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

export const Notice = ({ className, title, description, variant = 'info' }: INoticeProps) => {
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

export const NoticeInfo = (props: INoticeProps) => <Notice variant="info" {...props} />;
export const NoticeError = (props: INoticeProps) => <Notice variant="error" {...props} />;
export const NoticeWarning = (props: INoticeProps) => <Notice variant="warning" {...props} />;
export const NoticeSuccess = (props: INoticeProps) => <Notice variant="success" {...props} />;
