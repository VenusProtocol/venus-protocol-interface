/** @jsxImportSource @emotion/react */
import { GlobalStyles } from '@mui/material';
import React from 'react';
import { ToastOptions, toast as toastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Notice } from '../Notice';
import { NoticeVariant } from '../Notice/types';
import { customToastGlobalStyles, useStyles } from './styles';

interface ToastArgs {
  message: string;
}
interface ToastProps extends ToastArgs {
  type: NoticeVariant;
}
interface CloseButtonProps {
  closeToast: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ closeToast }) => {
  const styles = useStyles();

  return (
    <Button css={styles.btnClose} onClick={closeToast} variant="text">
      <Icon name="close" size={`${styles.iconSize}`} />
    </Button>
  );
};

const ToastComponent: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  const styles = useStyles();

  return (
    <>
      <GlobalStyles styles={customToastGlobalStyles} />
      <Notice css={styles.noticeContainer} description={message} variant={type} />
    </>
  );
};

const defaultOptions: ToastOptions = {
  theme: 'dark',
  position: 'top-right',
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  closeButton: CloseButton as ToastOptions['closeButton'],
};

export const toast = ({ message, type = 'info' }: ToastProps, options?: ToastOptions) =>
  toastify(<ToastComponent message={message} type={type} />, {
    ...defaultOptions,
    ...options,
  });

toast.info = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'info' }, options);

toast.error = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'error' }, options);

toast.success = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'success' }, options);

toast.warning = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'warning' }, options);

toast.update = toastify.update;
