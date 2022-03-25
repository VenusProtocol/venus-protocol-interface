/** @jsxImportSource @emotion/react */
import React, { ReactElement } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { Button, Modal as MUIModal, ModalProps } from '@mui/material';
import Fade from '@mui/material/Fade';
import { Icon } from '../Icon';
import { useModalStyles } from './styles';

export interface IModalProps extends Omit<ModalProps, 'title' | 'open'> {
  className?: string;
  isOpened: boolean;
  handleClose: () => void;
  title?: string | ReactElement | ReactElement[];
  noHorizontalPadding?: boolean;
}

export const Modal: React.FC<IModalProps> = ({
  className,
  children,
  handleClose,
  isOpened,
  title,
  noHorizontalPadding,
  ...otherModalProps
}) => {
  const s = useModalStyles({ hasTitleComponent: Boolean(title), noHorizontalPadding });
  return (
    <MUIModal
      open={isOpened}
      onClose={handleClose}
      onBackdropClick={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      {...otherModalProps}
    >
      <Fade in={isOpened}>
        <div css={s.box} className={className}>
          <div css={s.titleWrapper}>
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
