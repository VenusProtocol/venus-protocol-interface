import { forwardRef, useMemo, useState } from 'react';

import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { renderLabel } from './renderLabel';
import type { SelectOption, SelectProps } from './types';

export * from './types';

const getVariantClasses = ({
  variant,
  isMenuOpened,
}: {
  variant: SelectProps['variant'];
  isMenuOpened: boolean;
}) => {
  switch (variant) {
    case 'secondary':
      return cn(
        'border-lightGrey bg-lightGrey hover:border-blue hover:bg-lightGrey active:border-blue active:bg-lightGrey',
        isMenuOpened && 'border-blue hover:border-blue',
      );
    case 'tertiary':
      return cn(
        'border-transparent bg-cards hover:bg-cards hover:border-offWhite active:bg-cards active:border-blue',
        isMenuOpened && 'border-blue hover:border-blue',
      );
    case 'quaternary':
      return cn(
        'border-transparent bg-lightGrey rounded-xl hover:bg-lightGrey hover:border-grey active:bg-lightGrey active:border-blue',
        isMenuOpened && 'border-blue bg-lightGrey hover:border-blue',
      );
    // primary
    default:
      return cn(
        'border-lightGrey bg-cards hover:border-lightGrey hover:bg-lightGrey active:border-blue active:bg-lightGrey',
        isMenuOpened && 'border-blue bg-lightGrey hover:border-blue',
      );
  }
};

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  <TValue extends string | number = string | number>(
    {
      className,
      buttonClassName,
      options,
      value,
      onChange,
      onBlur,
      label,
      name,
      placeLabelToLeft = false,
      size = 'medium',
      variant = 'primary',
      menuTitle,
      menuPosition = 'left',
      testId,
    }: SelectProps<TValue>,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const { t } = useTranslation();

    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const handleToggleMenu = () => setIsMenuOpened(!isMenuOpened);

    const isMdOrUp = useBreakpointUp('md');

    const selectedOption = useMemo(
      () => options.find(option => option.value === value),
      [value, options],
    );

    const handleChange = (newValue: SelectOption<TValue>['value']) => {
      onChange(newValue);
      setIsMenuOpened(false);
    };

    const buttonSizeClasses = useMemo(() => {
      if (size === 'large') {
        return cn('px-4 h-14');
      }

      if (size === 'medium') {
        return cn('px-4 h-12');
      }

      return cn('px-3 h-10');
    }, [size]);

    const optionsDom = (
      <>
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => handleChange(option.value)}
            type="button"
            className={cn(
              'hover:bg-lightGrey active:bg-lightGrey flex min-w-full items-center justify-between py-3 text-left text-sm font-semibold',
              buttonSizeClasses,
            )}
          >
            <span className={cn('grow whitespace-nowrap')}>
              {renderLabel({ label: option.label })}
            </span>

            <Icon
              name="mark"
              className={cn(
                'text-green ml-4 w-3 shrink-0 opacity-0',
                value === option.value && 'opacity-1',
              )}
            />
          </button>
        ))}
      </>
    );

    return (
      <>
        <div className={cn(placeLabelToLeft && 'inline-flex items-center', className)}>
          <input
            ref={ref}
            name={name}
            value={value}
            className="hidden"
            onChange={e => {
              const formattedValue = (
                typeof value === 'number' ? +e.currentTarget.value : e.currentTarget.value
              ) as TValue;

              onChange(formattedValue);
            }}
            data-testid={testId}
          />

          {!!label && (
            <div className={cn(placeLabelToLeft ? 'mr-3 shrink-0' : 'mb-1')}>
              <p className={cn('text-grey text-sm font-semibold')}>{label}</p>
            </div>
          )}

          <div className="relative w-full">
            {/* XS to MD backdrop */}
            {isMenuOpened && (
              <div
                className="fixed bottom-0 left-0 right-0 top-0 hidden md:block"
                onClick={() => setIsMenuOpened(false)}
              />
            )}

            <Button
              onClick={handleToggleMenu}
              className={cn(
                'relative w-full',
                getVariantClasses({ variant, isMenuOpened }),
                buttonSizeClasses,
                buttonClassName,
              )}
              contentClassName={cn('w-full justify-between text-sm font-semibold')}
            >
              <span className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
                {selectedOption &&
                  renderLabel({ label: selectedOption.label, isRenderedInButton: true })}
              </span>

              <Icon
                name="arrowUp"
                className={cn(
                  'text-offWhite ml-2 w-5 h-5 flex-none',
                  isMenuOpened ? 'text-blue' : 'rotate-180',
                )}
              />
            </Button>

            {/* XS to MD menu */}
            {isMenuOpened && (
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

                  {optionsDom}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MD and up menu */}
        <Modal
          isOpen={isMenuOpened && !isMdOrUp}
          handleClose={handleToggleMenu}
          noHorizontalPadding
          onBlur={onBlur}
          title={menuTitle || t('select.defaultLabel')}
        >
          {optionsDom}
        </Modal>
      </>
    );
  },
);
