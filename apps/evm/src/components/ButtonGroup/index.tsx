import { type ButtonProps, SecondaryButton, cn } from '@venusprotocol/ui';

export interface ButtonGroupProps {
  buttonLabels: React.ReactNode[];
  activeButtonIndex: number;
  onButtonClick: (newIndex: number) => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  className?: string;
  buttonClassName?: string;
  buttonSize?: ButtonProps['size'];
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  buttonLabels,
  activeButtonIndex = 0,
  onButtonClick,
  fullWidth = false,
  variant = 'primary',
  className,
  buttonClassName,
  buttonSize,
}) => {
  return (
    <div
      className={cn(
        'flex items-center whitespace-nowrap',
        fullWidth ? 'w-full' : 'max-sm:w-full',
        variant === 'primary'
          ? 'bg-dark-blue-disabled border border-dark-blue-hover rounded-lg'
          : 'gap-x-3',
        className,
      )}
    >
      {buttonLabels.map((label, index) => (
        <SecondaryButton
          key={`button-group-button-${label}`}
          onClick={() => onButtonClick(index)}
          className={cn(
            'flex-1 border-transparent px-4 hover:border-transparent hover:text-white active:bg-blue active:border-blue',
            !fullWidth && 'max-sm:flex-auto',
            buttonClassName,
          )}
          active={index === activeButtonIndex}
          size={buttonSize}
        >
          {label}
        </SecondaryButton>
      ))}
    </div>
  );
};
