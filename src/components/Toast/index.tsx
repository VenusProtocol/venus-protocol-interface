/** @jsxImportSource @emotion/react */
import React from 'react';
import { toast as toastify, ToastOptions } from 'react-toastify';
import { GlobalStyles } from '@mui/material';

import { Notice } from '../Notice';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { NoticeVariant } from '../Notice/types';

import 'react-toastify/dist/ReactToastify.min.css';
import { customToastGlobalStyles, useStyles } from './styles';

interface IToastArgs {
  message: string;
}
interface IToastProps extends IToastArgs {
  type: NoticeVariant;
}
interface ICloseButtonProps {
  closeToast: () => void;
}

const CloseButton: React.FC<ICloseButtonProps> = ({ closeToast }) => {
  const classes = useStyles();
  return (
    <Button css={classes.btnClose} onClick={closeToast} variant="text">
      <Icon name="close" />
    </Button>
  );
};

const ToastComponent: React.FC<IToastProps> = ({ message, type = 'info' }) => {
  const classes = useStyles();
  return (
    <>
      <GlobalStyles styles={customToastGlobalStyles} />
      <Notice css={classes.noticeContainer} description={message} variant={type} />
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

export const toast = ({ message, type = 'info' }: IToastProps, options?: ToastOptions) =>
  toastify(<ToastComponent message={message} type={type} />, {
    ...defaultOptions,
    ...options,
  });

toast.info = (content: IToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'info' }, options);

toast.error = (content: IToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'error' }, options);

toast.success = (content: IToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'success' }, options);

toast.warning = (content: IToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'warning' }, options);

toast.update = toastify.update;
