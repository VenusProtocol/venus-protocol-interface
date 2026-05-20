import { useEffect, useRef, useState } from 'react';

import { cn } from '@venusprotocol/ui';
import { useBreakpointUp } from 'hooks/responsive';

import { useTranslation } from 'libs/translations';
import { Modal } from '../Modal';
import type { DropdownProps } from './types';

export * from './types';

export const Dropdown = ({
  className,
  children,
  optionsDom,
  optionClassName,
  menuClassName,
  onBlur,
  label,
  placeLabelToLeft = false,
  variant = 'primary',
  menuTitle,
  menuPosition = 'left',
  triggerOnHover = false,
}: DropdownProps) => {
  const { t } = useTranslation();
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const handleToggleDropdown = () => setIsDropdownOpened(!isDropdownOpened);

  const isMdOrUp = useBreakpointUp('md');

  // Hover-close timer: delay close on mouseLeave so the cursor has time to cross the gap between
  // the trigger and the dropdown menu without prematurely dismissing it.
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearHoverCloseTimer = () => {
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  };
  const handleHoverEnter = () => {
    clearHoverCloseTimer();
    setIsDropdownOpened(true);
  };
  const handleHoverLeave = () => {
    clearHoverCloseTimer();
    hoverCloseTimerRef.current = setTimeout(() => setIsDropdownOpened(false), 200);
  };
  useEffect(
    () => () => {
      if (hoverCloseTimerRef.current) {
        clearTimeout(hoverCloseTimerRef.current);
      }
    },
    [],
  );

  return (
    <>
      <div className={cn(placeLabelToLeft && 'inline-flex items-center', className)}>
        {!!label && (
          <div className={cn(placeLabelToLeft ? 'mr-3 shrink-0' : 'mb-1')}>
            <p className={cn('text-grey text-sm font-semibold')}>{label}</p>
          </div>
        )}

        <div
          className="relative w-full"
          onMouseEnter={triggerOnHover ? handleHoverEnter : undefined}
          onMouseLeave={triggerOnHover ? handleHoverLeave : undefined}
        >
          {/* MD and up backdrop — click mode only */}
          {isDropdownOpened && !triggerOnHover && (
            <div
              className="fixed bottom-0 left-0 right-0 top-0 hidden md:block z-50"
              onClick={() => setIsDropdownOpened(false)}
            />
          )}

          {children({ isDropdownOpened, handleToggleDropdown })}

          {/* XS to MD menu */}
          {isDropdownOpened && (
            <div className="relative z-50 hidden min-w-full md:block">
              <div
                className={cn('pt-2 absolute min-w-full', menuPosition === 'right' && 'right-0')}
              >
                <div
                  className={cn(
                    'border-lightGrey bg-cards overflow-hidden border shadow',
                    variant === 'quaternary' ? 'rounded-xl' : 'rounded-lg',
                    menuClassName,
                  )}
                >
                  {!!menuTitle && (
                    <div
                      className={cn(
                        'text-grey w-full py-3 text-xs',
                        variant === 'primary' ? 'px-3 sm:px-4' : 'px-3',
                      )}
                    >
                      {menuTitle}
                    </div>
                  )}

                  {optionsDom({ setIsDropdownOpened, optionClassName })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* XS to MD menu */}
      <Modal
        isOpen={isDropdownOpened && !isMdOrUp}
        handleClose={handleToggleDropdown}
        noHorizontalPadding
        onBlur={onBlur}
        title={menuTitle || t('select.defaultLabel')}
      >
        {optionsDom({ setIsDropdownOpened, optionClassName })}
      </Modal>
    </>
  );
};
