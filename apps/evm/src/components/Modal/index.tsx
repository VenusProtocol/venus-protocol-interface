import { type FC, type HTMLAttributes, type ReactElement, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@venusprotocol/ui';
import { Icon } from '../Icon';
import { MODAL_BACKDROP_TEST_ID } from './testIds';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  className?: string;
  backdropClassName?: string;
  buttonClassName?: string;
  rootClassName?: string;
  isOpen: boolean;
  handleClose?: () => void;
  handleBackAction?: () => void;
  title?: string | ReactElement | ReactElement[];
  noHorizontalPadding?: boolean;
  portalContainer?: Element | DocumentFragment | null;
}

export const Modal: FC<ModalProps> = ({
  className,
  backdropClassName,
  buttonClassName,
  children,
  rootClassName,
  handleClose,
  handleBackAction,
  isOpen,
  title,
  noHorizontalPadding,
  portalContainer,
  ...otherModalProps
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const hasHeader = !!title || handleBackAction || handleClose;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    rootRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      aria-label={title ? undefined : 'Dialog'}
      aria-labelledby={title ? titleId : undefined}
      aria-modal="true"
      className="fixed inset-0 z-99999 m-0 h-dvh max-h-none w-dvw max-w-none overflow-visible border-0 bg-transparent p-0 text-white outline-hidden backdrop:bg-transparent"
      ref={rootRef}
      role="dialog"
      tabIndex={-1}
    >
      <div
        className={cn('fixed inset-0 z-9999 backdrop-blur-xs', backdropClassName)}
        data-testid={MODAL_BACKDROP_TEST_ID}
        onClick={event => {
          event.stopPropagation();
          handleClose?.();
        }}
      />

      <div className={cn('pointer-events-none fixed inset-0 z-99999', rootClassName)}>
        <div
          className={cn(
            'pointer-events-auto absolute top-1/2 left-1/2 flex max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-136 -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto rounded-xl border border-blue bg-dark-blue outline-hidden',
            !hasHeader && 'pt-4 md:pt-6',
            className,
          )}
          {...otherModalProps}
        >
          {hasHeader && (
            <div
              className={cn(
                'sticky top-0 z-10 flex items-center justify-center rounded-t-2xl px-6 pt-6',
                title ? 'mb-4 bg-dark-blue pb-6 md:mb-0' : 'pb-0',
              )}
            >
              {!!handleBackAction && (
                <button
                  className={cn(
                    'absolute left-6 flex size-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0',
                    buttonClassName,
                  )}
                  type="button"
                  onClick={handleBackAction}
                >
                  <Icon name="arrowRight" className="size-6 rotate-180 text-white" />
                </button>
              )}

              {title ? (
                <h2
                  className="m-0 flex min-h-6 items-center justify-center px-6 text-center text-lg"
                  id={titleId}
                >
                  {title}
                </h2>
              ) : (
                <div className="flex min-h-6 items-center justify-center px-6" />
              )}

              {!!handleClose && (
                <button
                  aria-label="Close"
                  className={cn(
                    'absolute right-6 top-1/2 -mt-3 flex size-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0',
                    buttonClassName,
                  )}
                  type="button"
                  onClick={handleClose}
                >
                  <Icon name="close" className="size-6" />
                </button>
              )}
            </div>
          )}

          <div className={cn('pb-4 md:pb-6', noHorizontalPadding ? 'px-0' : 'px-4 md:px-6')}>
            {children}
          </div>
        </div>
      </div>
    </div>,
    portalContainer ?? document.body,
  );
};
