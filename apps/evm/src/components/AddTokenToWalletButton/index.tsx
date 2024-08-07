import { useAddTokenToWallet } from 'libs/wallet';
import type { Token } from 'types';
import { cn } from 'utilities';
import { type ButtonProps, TertiaryButton } from '../Button';
import { Icon } from '../Icon';

export interface AddTokenToWalletButtonProps extends Omit<ButtonProps, 'onClick' | 'variant'> {
  token: Token;
}

export const AddTokenToWalletButton: React.FC<AddTokenToWalletButtonProps> = ({
  className,
  token,
  ...otherProps
}) => {
  const { addTokenToWallet } = useAddTokenToWallet();

  return (
    <TertiaryButton
      className={cn(
        'p-1 h-8 w-8',
        'border-transparent hover:border-transparent active:border-transparent bg-background hover:bg-background active:bg-background text-grey hover:text-offWhite active:text-blue',
        className,
      )}
      onClick={() => addTokenToWallet(token)}
      {...otherProps}
    >
      <Icon name="wallet" className="ml-[1px] h-5 w-5 text-inherit " />
    </TertiaryButton>
  );
};
