import {
  Button,
  type DrawerProps,
  Modal as MUIModal,
  type ModalProps as MUIModalProps,
} from '@mui/material';
import Fade from '@mui/material/Fade';
import type { ReactElement } from 'react';

import config from 'config';

import { cn } from '@venusprotocol/ui';
import { BodyBackdrop } from '../BodyBackdrop';
import { Icon } from '../Icon';
import { useModalStyles } from './styles';

export interface ModalProps extends Omit<MUIModalProps, 'title' | 'open'> {
  className?: string;
  buttonClassName?: string;
  isOpen: boolean;
  handleClose?: () => void;
  handleBackAction?: () => void;
  title?: string | ReactElement | ReactElement[];
  noHorizontalPadding?: boolean;
  anchor?: DrawerProps['anchor'];
}

export const Modal: React.FC<ModalProps> = ({
  className,
  buttonClassName,
  children,
  componentsProps,
  handleClose,
  handleBackAction,
  isOpen,
  title,
  noHorizontalPadding,
  anchor = 'bottom',
  ...otherModalProps
}) => {
  const s = useModalStyles({ hasTitleComponent: Boolean(title), noHorizontalPadding });

  const hasHeader = !!title || handleBackAction || handleClose;

  const dom = (
    <div
      className={cn(
        'pointer-events-auto flex flex-col overflow-auto outline-hidden bg-dark-blue rounded-xl border border-blue absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] max-w-136 w-[calc(100%-2rem)] max-h-[calc(100%-2rem)]',
        !hasHeader && 'pt-4 md:pt-6',
        className,
      )}
    >
      {hasHeader && (
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

          {handleClose && (
            <Button
              css={s.closeIcon}
              className={cn('right-6', buttonClassName)}
              disableRipple
              onClick={handleClose}
            >
              <Icon name="close" className="size-6" />
            </Button>
          )}
        </div>
      )}

      <div css={s.contentWrapper}>{children as React.ReactNode}</div>
    </div>
  );

  return (
    <>
      {isOpen && <BodyBackdrop onClick={handleClose} />}

      <MUIModal
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        hideBackdrop
        disablePortal={config.environment === 'storybook'}
        componentsProps={{
          ...componentsProps,
          root: {
            ...(componentsProps?.root || {}),
            className: cn('pointer-events-none', componentsProps?.root?.className),
            style: {
              zIndex: 99999,
            },
          },
        }}
        {...otherModalProps}
      >
        <Fade in={isOpen}>{dom}</Fade>
      </MUIModal>
    </>
  );
};
