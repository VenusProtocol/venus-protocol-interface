import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { useTranslation } from 'libs/translations';
import { useAddTokenToWallet } from 'libs/wallet';
import type { Token } from 'types';
import { cn } from 'utilities';
import { type ButtonProps, TertiaryButton } from '../Button';
import { Icon } from '../Icon';

export interface AddTokenToWalletButtonProps extends Omit<ButtonProps, 'onClick' | 'variant'> {
  isUserConnected: boolean;
  token: Token;
}

export const AddTokenToWalletButton: React.FC<AddTokenToWalletButtonProps> = ({
  className,
  isUserConnected,
  token,
  ...otherProps
}) => {
  const { addTokenToWallet } = useAddTokenToWallet();
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.address'));

  return (
    <TertiaryButton
      className={cn(
        'p-1 h-8 w-8',
        'border-transparent hover:border-transparent active:border-transparent bg-background hover:bg-background active:bg-background text-grey hover:text-offWhite active:text-blue',
        className,
      )}
      onClick={() => (isUserConnected ? addTokenToWallet(token) : copyToClipboard(token.address))}
      {...otherProps}
    >
      <Icon name={isUserConnected ? 'wallet' : 'copy'} className="ml-[1px] h-5 w-5 text-inherit " />
    </TertiaryButton>
  );
};
