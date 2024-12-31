import { useMemo, useState } from 'react';

import { useBreakpointUp } from 'hooks/responsive';
import { cn } from 'utilities';

import { useTranslation } from 'libs/translations';
import { Button } from '../Button';
import { Modal } from '../Modal';
import type { DropdownProps } from './types';

export * from './types';

const getVariantClasses = ({
  variant,
  isDropdownOpened,
}: {
  variant: DropdownProps['variant'];
  isDropdownOpened: boolean;
}) => {
  switch (variant) {
    case 'secondary':
      return cn(
        'border-lightGrey bg-lightGrey hover:border-blue hover:bg-lightGrey active:border-blue active:bg-lightGrey',
        isDropdownOpened && 'border-blue hover:border-blue',
      );
    case 'tertiary':
      return cn(
        'border-transparent bg-cards hover:bg-cards hover:border-offWhite active:bg-cards active:border-blue',
        isDropdownOpened && 'border-blue hover:border-blue',
      );
    case 'quaternary':
      return cn(
        'border-transparent bg-lightGrey rounded-xl hover:bg-lightGrey hover:border-grey active:bg-lightGrey active:border-blue',
        isDropdownOpened && 'border-blue bg-lightGrey hover:border-blue',
      );
    // primary
    default:
      return cn(
        'border-lightGrey bg-cards hover:border-lightGrey hover:bg-lightGrey active:border-blue active:bg-lightGrey',
        isDropdownOpened && 'border-blue bg-lightGrey hover:border-blue',
      );
  }
};

export const Dropdown = ({
  className,
  children,
  buttonClassName,
  optionClassName,
  optionsDom,
  onBlur,
  label,
  placeLabelToLeft = false,
  size = 'medium',
  variant = 'primary',
  menuTitle,
  menuPosition = 'left',
}: DropdownProps) => {
  const { t } = useTranslation();
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const handleToggleDropdown = () => setIsDropdownOpened(!isDropdownOpened);

  const isMdOrUp = useBreakpointUp('md');

  const buttonSizeClasses = useMemo(() => {
    if (size === 'large') {
      return cn('px-4 h-14');
    }

    if (size === 'medium') {
      return cn('px-4 h-12');
    }

    return cn('px-3 h-10');
  }, [size]);

  return (
    <>
      <div className={cn(placeLabelToLeft && 'inline-flex items-center', className)}>
        {!!label && (
          <div className={cn(placeLabelToLeft ? 'mr-3 shrink-0' : 'mb-1')}>
            <p className={cn('text-grey text-sm font-semibold')}>{label}</p>
          </div>
        )}

        <div className="relative w-full">
          {/* MD and up menu */}
          {isDropdownOpened && (
            <div
              className="fixed bottom-0 left-0 right-0 top-0 hidden md:block z-10"
              onClick={() => setIsDropdownOpened(false)}
            />
          )}

          <Button
            onClick={handleToggleDropdown}
            className={cn(
              'relative w-full',
              getVariantClasses({ variant, isDropdownOpened }),
              buttonSizeClasses,
              buttonClassName,
            )}
            contentClassName={cn('w-full justify-center text-sm font-semibold', optionClassName)}
          >
            {children({ isDropdownOpened })}
          </Button>

          {/* XS to MD backdrop */}
          {isDropdownOpened && (
            <div className="relative z-10 hidden min-w-full md:block">
              <div
                className={cn(
                  'border-lightGrey bg-cards absolute top-2 min-w-full overflow-hidden border shadow',
                  menuPosition === 'right' && 'right-0',
                  variant === 'quaternary' ? 'rounded-xl' : 'rounded-lg',
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

                {optionsDom({ setIsDropdownOpened, buttonSizeClasses })}
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
        {optionsDom({ setIsDropdownOpened, buttonSizeClasses })}
      </Modal>
    </>
  );
};
