import { useState } from 'react';

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
}: DropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleToggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const isMdOrUp = useBreakpointUp('md');

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
          {isDropdownOpen && (
            <div className="relative z-50 hidden min-w-full md:block">
              <div
                className={cn('pt-2 absolute min-w-full', menuPosition === 'right' && 'right-0')}
              >
                <div
                  className={cn(
                    'border-lightGrey bg-cards overflow-visible border shadow',
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

                  {optionsDom({ setIsDropdownOpen, optionClassName })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* XS to MD menu */}
      <Modal
        isOpen={isDropdownOpen && !isMdOrUp}
        handleClose={handleToggleDropdown}
        backdropClassName="z-100000"
        componentsProps={{
          root: {
            style: {
              zIndex: 100001,
            },
          },
        }}
        noHorizontalPadding
        onBlur={onBlur}
        title={menuTitle}
      >
        {optionsDom({ setIsDropdownOpen, optionClassName })}
      </Modal>
    </>
  );
};
