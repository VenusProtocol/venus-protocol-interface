import { addTokenToWallet } from 'libs/wallet';
import type { Token } from 'types';
import { cn } from 'utilities';
import { type ButtonProps, TertiaryButton } from '../Button';
import { Icon } from '../Icon';

export interface AddTokenToWalletButtonProps extends Omit<ButtonProps, 'onClick'> {
  token: Token;
}

export const AddTokenToWalletButton: React.FC<AddTokenToWalletButtonProps> = ({
  className,
  token,
  ...otherProps
}) => (
  <TertiaryButton
    className={cn(
      'border-cards bg-background text-blue hover:text-offWhite p-1 h-8 w-8',
      className,
    )}
    onClick={() => addTokenToWallet(token)}
    {...otherProps}
  >
    <Icon name="wallet" className="ml-[1px] h-5 w-5 text-inherit " />
  </TertiaryButton>
);
