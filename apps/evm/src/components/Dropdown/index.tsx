import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@venusprotocol/ui';
import { useBreakpointUp } from 'hooks/responsive';

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
  modalPortalContainer,
  renderMenuInPortal = false,
}: DropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleToggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const isMdOrUp = useBreakpointUp('md');

  const triggerRef = useRef<HTMLDivElement>(null);
  const [portalMenu, setPortalMenu] = useState<{
    container: Element;
    style: React.CSSProperties;
  }>();
  const isPortalMenuActive = renderMenuInPortal && isDropdownOpen && isMdOrUp;

  useLayoutEffect(() => {
    const trigger = triggerRef.current;

    if (!isPortalMenuActive || !trigger) {
      setPortalMenu(undefined);
      return;
    }

    const container = trigger.closest('[role="dialog"]') ?? document.body;
    const updatePosition = () => {
      const rect = trigger.getBoundingClientRect();

      setPortalMenu({
        container,
        style: {
          top: rect.bottom,
          minWidth: rect.width,
          ...(menuPosition === 'right'
            ? { right: window.innerWidth - rect.right }
            : { left: rect.left }),
        },
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isPortalMenuActive, menuPosition]);

  const menuDom = (
    <div
      className={cn(
        'border-raised bg-menu shadow-menu overflow-visible border backdrop-blur-raised backdrop-saturate-[1.2]',
        variant === 'quaternary' ? 'rounded-xl' : 'rounded-lg',
        menuClassName,
      )}
    >
      {!!menuTitle && (
        <div
          className={cn(
            'text-secondary w-full py-3 text-xs',
            variant === 'primary' ? 'px-3 sm:px-4' : 'px-3',
          )}
        >
          {menuTitle}
        </div>
      )}

      {optionsDom({ setIsDropdownOpen, optionClassName })}
    </div>
  );

  return (
    <>
      <div className={cn(placeLabelToLeft && 'inline-flex items-center', className)}>
        {!!label && (
          <div className={cn(placeLabelToLeft ? 'mr-3 shrink-0' : 'mb-1')}>
            <p className={cn('text-secondary text-sm font-semibold')}>{label}</p>
          </div>
        )}

        <div
          ref={triggerRef}
          className="relative w-full"
          onMouseEnter={triggerOnHover && isMdOrUp ? () => setIsDropdownOpen(true) : undefined}
          onMouseLeave={triggerOnHover && isMdOrUp ? () => setIsDropdownOpen(false) : undefined}
        >
          {/* MD and up backdrop — click mode only */}
          {isDropdownOpen && !triggerOnHover && (
            <div
              className="fixed bottom-0 left-0 right-0 top-0 hidden md:block z-50"
              onClick={() => setIsDropdownOpen(false)}
            />
          )}

          {children({ isDropdownOpen, handleToggleDropdown })}

          {/* MD and up menu */}
          {isDropdownOpen && !renderMenuInPortal && (
            <div className="relative z-50 hidden min-w-full md:block">
              <div
                className={cn('pt-2 absolute min-w-full', menuPosition === 'right' && 'right-0')}
              >
                {menuDom}
              </div>
            </div>
          )}
        </div>
      </div>

      {portalMenu &&
        createPortal(
          <div className="fixed z-100000 pt-2" style={portalMenu.style}>
            {menuDom}
          </div>,
          portalMenu.container,
        )}

      {/* XS to MD menu */}
      <Modal
        isOpen={isDropdownOpen && !isMdOrUp}
        handleClose={handleToggleDropdown}
        backdropClassName="z-100000"
        rootClassName="z-100001"
        noHorizontalPadding
        className="overflow-hidden"
        contentClassName="min-h-0 overflow-y-auto overscroll-contain"
        onBlur={onBlur}
        title={menuTitle}
        portalContainer={modalPortalContainer}
      >
        {optionsDom({ setIsDropdownOpen, optionClassName })}
      </Modal>
    </>
  );
};
