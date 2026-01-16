import { TertiaryButton, cn } from '@venusprotocol/ui';

export interface ButtonGroupProps {
  buttonLabels: React.ReactNode[];
  activeButtonIndex: number;
  onButtonClick: (newIndex: number) => void;
  fullWidth?: boolean;
  className?: string;
  buttonClassName?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  buttonLabels,
  activeButtonIndex = 0,
  onButtonClick,
  fullWidth = false,
  className,
  buttonClassName,
}) => {
  return (
    <div
      className={cn('flex items-center gap-x-4', fullWidth ? 'w-full' : 'max-sm:w-full', className)}
    >
      {buttonLabels.map((label, index) => (
        <TertiaryButton
          key={`button-group-button-${label}`}
          onClick={() => onButtonClick(index)}
          className={cn('flex-1', !fullWidth && 'max-sm:flex-auto', buttonClassName)}
          active={index === activeButtonIndex}
        >
          {label}
        </TertiaryButton>
      ))}
    </div>
  );
};
