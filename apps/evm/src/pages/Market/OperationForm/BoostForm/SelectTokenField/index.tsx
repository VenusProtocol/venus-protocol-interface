import { type ButtonProps, Icon, QuinaryButton, TokenIconWithSymbol, cn } from 'components';
import type { Token } from 'types';

export interface SelectTokenFieldProps {
  onButtonClick: ButtonProps['onClick'];
  token: Token;
  isActive: boolean;
  label: string;
  disabled?: boolean;
  className?: string;
}

export const SelectTokenField: React.FC<SelectTokenFieldProps> = ({
  token,
  onButtonClick,
  isActive,
  disabled,
  label,
  className,
}) => (
  <div className={className}>
    <p className="text-sm font-semibold text-grey">{label}</p>

    <QuinaryButton
      className={cn(
        'px-4 h-14 w-full rounded-xl active:bg-lightGrey active:border-blue disabled:bg-transparent disabled:border-lightGrey',
        isActive && 'border-blue bg-lightGrey',
      )}
      contentClassName="w-full justify-between disabled:bg-transparent"
      onClick={onButtonClick}
      disabled={disabled}
    >
      <div className="flex items-center gap-x-2">
        <TokenIconWithSymbol token={token} />
      </div>

      <Icon
        name="arrowUp"
        className={cn(
          'w-5 h-5',
          !isActive && 'rotate-180',
          disabled ? 'text-grey' : 'text-offWhite',
        )}
      />
    </QuinaryButton>
  </div>
);
