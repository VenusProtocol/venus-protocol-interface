/** @jsxImportSource @emotion/react */
import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Icon } from '../Icon';
import { NoticeVariant } from './types';
import { useStyles } from './styles';

interface INoticeProps {
  className?: string;
  title?: string;
  description: string;
  variant?: NoticeVariant;
}

const getNoticeIconName = (variant: NoticeVariant): 'info' | 'notice' | 'checkInline' => {
  switch (variant) {
    case 'error':
      return 'notice';
    case 'success':
      return 'checkInline';
    default:
    case 'info':
      return 'info';
  }
};

export const Notice = ({ className, title, description, variant = 'info' }: INoticeProps) => {
  const styles = useStyles();

  return (
    <Paper css={[styles.root, styles.getRootStyles({ variant })]} className={className}>
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
        <Typography variant="small2" color="text.primary">
          {description}
        </Typography>
      </div>
    </Paper>
  );
};

export const NoticeInfo = (props: INoticeProps) => <Notice variant="info" {...props} />;
export const NoticeError = (props: INoticeProps) => <Notice variant="error" {...props} />;
export const NoticeSuccess = (props: INoticeProps) => <Notice variant="success" {...props} />;
