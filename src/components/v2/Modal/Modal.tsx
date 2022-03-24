import React, { ReactElement } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { Button, Modal as MUIModal, ModalProps } from '@mui/material';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { useModalStyles } from './ModalStyles';
import { Icon } from '../Icon';

export interface IModalProps extends ModalProps {
  className?: string;
  isOpened: boolean;
  handleClose: () => void;
  modalTitle?: string | ReactElement | ReactElement[];
  noHorizontalPadding?: boolean;
}

export const Modal: React.FC<IModalProps> = ({
  className,
  children,
  handleClose,
  isOpened,
  modalTitle,
  noHorizontalPadding,
}) => {
  const s = useModalStyles({ hasTitleComponent: Boolean(modalTitle), noHorizontalPadding });
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
    >
      <Fade in={isOpened}>
        <Box className={className} sx={s.box}>
          <Box sx={s.titleWrapper}>
            <Box sx={s.titleComponent}>{modalTitle}</Box>
            <Button sx={s.closeIcon} disableRipple onClick={handleClose}>
              <Icon name="close" />
            </Button>
          </Box>
          <div style={s.contentWrapper}>{children}</div>
        </Box>
      </Fade>
    </MUIModal>
  );
};
