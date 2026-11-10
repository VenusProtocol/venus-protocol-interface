import { type ButtonProps, SecondaryButton, cn } from '@venusprotocol/ui';

export interface ButtonGroupProps {
  buttonLabels: React.ReactNode[];
  activeButtonIndex: number;
  onButtonClick: (newIndex: number) => void;
  fullWidth?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  buttonClassName?: string;
  buttonSize?: ButtonProps['size'];
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  buttonLabels,
  activeButtonIndex = 0,
  onButtonClick,
  fullWidth = false,
  disabled = false,
  ariaLabel,
  className,
  buttonClassName,
  buttonSize,
}) => {
  const handleButtonClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!disabled) {
      onButtonClick(index);
    }
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'flex items-center whitespace-nowrap rounded-lg border border-dark-blue-hover bg-dark-blue-disabled p-[3px] shadow-segment-track',
        fullWidth ? 'w-full' : 'w-fit',
        className,
      )}
    >
      {buttonLabels.map((label, index) => {
        const isActive = index === activeButtonIndex;

        return (
          <SecondaryButton
            key={`button-group-button-${index}`}
            onClick={e => handleButtonClick(e, index)}
            className={cn(
              'min-w-0 rounded-lg px-3 text-sm duration-160 before:hidden backdrop-blur-none! backdrop-saturate-100 focus-visible:-outline-offset-2',
              fullWidth && 'h-[45px] flex-1 py-0',
              !fullWidth &&
                (buttonSize === 'sm' ? 'h-7 flex-none py-0' : 'h-[33px] flex-none py-1.5'),
              isActive
                ? 'border-border-segment-active bg-action font-semibold text-white shadow-segment-active active:shadow-segment-active!'
                : 'border-transparent bg-none bg-transparent font-normal text-light-grey shadow-none! hover:font-normal hover:text-light-grey active:shadow-none!',
              isActive && !disabled && 'hover:bg-action-hover',
              !isActive && !disabled && 'hover:bg-surface-segment-hover',
              disabled && 'cursor-not-allowed aria-disabled:opacity-45',
              disabled && !isActive && 'aria-disabled:bg-transparent',
              disabled &&
                isActive &&
                'aria-disabled:border-border-segment-active aria-disabled:bg-action! aria-disabled:text-white',
              buttonClassName,
            )}
            active={isActive}
            aria-pressed={isActive}
            aria-disabled={disabled || undefined}
            size={buttonSize}
          >
            {label}
          </SecondaryButton>
        );
      })}
    </div>
  );
};
