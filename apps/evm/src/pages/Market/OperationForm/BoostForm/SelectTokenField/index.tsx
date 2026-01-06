import { type ButtonProps, Icon, TertiaryButton, TokenIconWithSymbol, cn } from 'components';
import { getTokenSelectButtonTestId } from 'components/SelectTokenTextField/testIdGetters';
import type { Token } from 'types';

export interface SelectTokenFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  onButtonClick: ButtonProps['onClick'];
  token: Token;
  isActive: boolean;
  label: string;
  disabled?: boolean;
  'data-testid'?: string;
}

export const SelectTokenField: React.FC<SelectTokenFieldProps> = ({
  token,
  onButtonClick,
  isActive,
  disabled,
  label,
  className,
  'data-testid': testId,
  ...otherProps
}) => (
  <div className={className} data-testid={testId} {...otherProps}>
    <p className="text-sm text-grey mb-1">{label}</p>

    <TertiaryButton
      className={cn(
        'px-4 h-14 w-full rounded-xl disabled:bg-transparent disabled:border-lightGrey',
        isActive && 'border-blue',
      )}
      contentClassName="w-full justify-between disabled:bg-transparent"
      onClick={onButtonClick}
      disabled={disabled}
      data-testid={
        !!testId &&
        getTokenSelectButtonTestId({
          parentTestId: testId,
        })
      }
    >
      <div className="flex items-center gap-x-2">
        <TokenIconWithSymbol token={token} />
      </div>

      <Icon
        name="arrowUp"
        className={cn('w-5 h-5', !isActive && 'rotate-180', disabled ? 'text-grey' : 'text-white')}
      />
    </TertiaryButton>
  </div>
);
