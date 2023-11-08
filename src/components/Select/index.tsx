import { useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { cn } from 'utilities';

import { useBreakpointUp } from 'hooks/responsive';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Option } from './Option';
import { SelectOption, SelectProps } from './types';

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
        'h-10 border-cards bg-cards px-3 hover:border-grey hover:bg-cards active:border-grey active:bg-cards',
        isMenuOpened && 'border-blue hover:border-blue',
      );
    // primary
    default:
      return cn(
        'border-lightGrey bg-cards px-3 hover:border-lightGrey hover:bg-lightGrey active:bg-lightGrey sm:px-4',
        isMenuOpened && 'border-blue bg-lightGrey hover:border-blue',
      );
  }
};

export const Select: React.FC<SelectProps> = ({
  className,
  buttonClassName,
  options,
  value,
  onChange,
  onBlur,
  label,
  name,
  placeLabelToLeft = false,
  variant = 'primary',
}) => {
  const { t } = useTranslation();

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const handleToggleMenu = () => setIsMenuOpened(!isMenuOpened);

  const isMdOrUp = useBreakpointUp('md');

  const selectedOption = useMemo(
    () => options.find(option => option.value === value),
    [value, options],
  );

  const handleChange = (newValue: SelectOption['value']) => {
    onChange(newValue);
    setIsMenuOpened(false);
  };

  const optionsDom = (
    <>
      {options.map(option => (
        <Option
          key={option.value}
          isSelected={value === option.value}
          onClick={() => handleChange(option.value)}
          variant={variant}
        >
          {option.label}
        </Option>
      ))}
    </>
  );

  return (
    <>
      <input
        name={name}
        value={value}
        className="h-0 w-0"
        onChange={e => onChange(e.currentTarget.value)}
      />

      <div className={cn(placeLabelToLeft && 'inline-flex items-center', className)}>
        {!!label && (
          <div className={cn(placeLabelToLeft ? 'mr-3 shrink-0' : 'mb-1')}>
            <p
              className={cn(
                'text-sm font-semibold text-grey',
                !placeLabelToLeft && 'text-offWhite',
              )}
            >
              {label}
            </p>
          </div>
        )}

        <div className="relative w-full grow">
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
              buttonClassName,
            )}
            contentClassName={cn(
              'w-full justify-between text-sm',
              variant === 'secondary' && 'font-normal',
            )}
          >
            <span className="shrink-0 grow text-left">{selectedOption?.label}</span>

            <Icon
              name="arrowUp"
              className={cn(
                'ml-3 w-[10px] flex-none text-offWhite',
                isMenuOpened ? 'text-blue' : 'rotate-180',
              )}
            />
          </Button>

          {/* XS to MD menu */}
          {isMenuOpened && (
            <div className="relative hidden min-w-full md:block">
              <div className="absolute top-2 min-w-full overflow-hidden rounded-lg border border-lightGrey bg-cards shadow">
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
        title={label || t('select.defaultLabel')}
      >
        {optionsDom}
      </Modal>
    </>
  );
};
