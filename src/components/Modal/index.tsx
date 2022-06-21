/** @jsxImportSource @emotion/react */
import React, { ReactElement } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { Button, Modal as MUIModal, ModalProps } from '@mui/material';
import Fade from '@mui/material/Fade';
import { Icon } from '../Icon';
import { useModalStyles } from './styles';

export interface IModalProps extends Omit<ModalProps, 'title' | 'open'> {
  className?: string;
  isOpen: boolean;
  handleClose: () => void;
  handleBackAction?: () => void;
  title?: string | ReactElement | ReactElement[];
  noHorizontalPadding?: boolean;
}

export const Modal: React.FC<IModalProps> = ({
  className,
  children,
  handleClose,
  handleBackAction = undefined,
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
      disablePortal={!!process.env.STORYBOOK}
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
              <Icon name="close" />
            </Button>
          </div>
          <div css={s.contentWrapper}>{children}</div>
        </div>
      </Fade>
    </MUIModal>
  );
};
