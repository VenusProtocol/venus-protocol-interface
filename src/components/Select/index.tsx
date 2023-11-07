import { useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { cn } from 'utilities';

import { ButtonWrapper } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Option } from './Option';
import { SelectOption, SelectProps } from './types';

export * from './types';

export const Select: React.FC<SelectProps> = ({
  className,
  options,
  value,
  onChange,
  onBlur,
  label,
  placeLabelToLeft = false,
}) => {
  const { t } = useTranslation();

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const handleToggleMenu = () => setIsMenuOpened(!isMenuOpened);

  const selectedOption = useMemo(
    () => options.find(option => option.value === value),
    [value, options],
  );

  const handleChange = (newValue: SelectOption['value']) => {
    onChange(newValue);
    setIsMenuOpened(false);
  };

  return (
    <>
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

        <ButtonWrapper
          onClick={handleToggleMenu}
          className="w-full grow justify-between text-sm"
          variant="tertiary"
        >
          <span>{selectedOption?.label}</span>

          <Icon
            name="arrowUp"
            className={cn(
              'ml-3 w-2 shrink-0 text-offWhite',
              isMenuOpened ? 'text-blue' : 'rotate-180',
            )}
          />
        </ButtonWrapper>
      </div>

      <Modal
        isOpen={isMenuOpened}
        handleClose={handleToggleMenu}
        noHorizontalPadding
        onBlur={onBlur}
        title={label || t('select.defaultLabel')}
      >
        <>
          {options.map(option => (
            <Option
              key={option.value}
              isSelected={value === option.value}
              onClick={() => handleChange(option.value)}
            >
              {option.label}
            </Option>
          ))}
        </>
      </Modal>
    </>
  );
};
