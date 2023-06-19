/** @jsxImportSource @emotion/react */
import { Button, Modal as MUIModal, ModalProps as MUIModalProps } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import config from 'config';
import React, { ReactElement } from 'react';

import { Icon } from '../Icon';
import { useModalStyles } from './styles';

export interface ModalProps extends Omit<MUIModalProps, 'title' | 'open'> {
  className?: string;
  isOpen: boolean;
  handleClose: () => void;
  handleBackAction?: () => void;
  title?: string | ReactElement | ReactElement[];
  noHorizontalPadding?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  className,
  children,
  handleClose,
  handleBackAction,
  isOpen,
  title,
  noHorizontalPadding,
  ...otherModalProps
}) => {
  const s = useModalStyles({ hasTitleComponent: Boolean(title), noHorizontalPadding });
  return (
    <MUIModal
      open={isOpen}
      onClose={handleClose}
      onBackdropClick={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disablePortal={config.environment === 'storybook'}
      {...otherModalProps}
    >
      <Fade in={isOpen}>
        <div css={s.box} className={className}>
          <div css={s.titleWrapper}>
            {!!handleBackAction && (
              <Button css={s.backAction} disableRipple onClick={handleBackAction}>
                <Icon css={s.backArrow} name="arrowRight" />
              </Button>
            )}
            <div css={s.titleComponent}>{title}</div>
            <Button css={s.closeIcon} disableRipple onClick={handleClose}>
              <Icon name="close" size={`${s.closeIconSize}`} />
            </Button>
          </div>
          <div css={s.contentWrapper}>{children}</div>
        </div>
      </Fade>
    </MUIModal>
  );
};
