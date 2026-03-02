/** @jsxImportSource @emotion/react */
import { Button, Modal as MUIModal, type ModalProps as MUIModalProps } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import type { ReactElement } from 'react';

import config from 'config';

import { cn } from '@venusprotocol/ui';
import { Icon } from '../Icon';
import { useModalStyles } from './styles';

export interface ModalProps extends Omit<MUIModalProps, 'title' | 'open'> {
  className?: string;
  buttonClassName?: string;
  isOpen: boolean;
  handleClose: () => void;
  handleBackAction?: () => void;
  title?: string | ReactElement | ReactElement[];
  noHorizontalPadding?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  className,
  buttonClassName,
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
        <div
          className={cn(
            'overflow-auto outline-hidden bg-dark-blue rounded-xl absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] border border-blue max-w-136 w-[calc(100%-2rem)] max-h-[calc(100%-2rem)]',
            className,
          )}
        >
          <div css={s.titleWrapper}>
            {!!handleBackAction && (
              <Button
                css={s.backAction}
                className={buttonClassName}
                disableRipple
                onClick={handleBackAction}
              >
                <Icon css={s.backArrow} name="arrowRight" />
              </Button>
            )}
            <div css={s.titleComponent}>{title}</div>
            <Button
              css={s.closeIcon}
              className={cn('right-6', buttonClassName)}
              disableRipple
              onClick={handleClose}
            >
              <Icon name="close" className="size-6" />
            </Button>
          </div>
          <div css={s.contentWrapper}>{children as React.ReactNode}</div>
        </div>
      </Fade>
    </MUIModal>
  );
};
