import { cn } from '@venusprotocol/ui';
import { type ButtonProps, Dropdown, Icon } from 'components';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { useTranslation } from 'libs/translations';
import { useAddTokenToWallet } from 'libs/wallet';
import type { Token, VToken, VhToken } from 'types';
import { DropdownToggleButton } from '../DropdownToggleButton';
import { TokenDropdownOption } from '../TokenDropdownOption';

export interface AddTokenToWalletDropdownProps extends Omit<ButtonProps, 'onClick' | 'variant'> {
  isUserConnected: boolean;
  tokens: Array<Token | VToken | VhToken>;
}

export const AddTokenToWalletDropdown: React.FC<AddTokenToWalletDropdownProps> = ({
  className,
  isUserConnected,
  tokens,
}) => {
  const { addTokenToWallet } = useAddTokenToWallet();
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.address.name'));

  const optionsDom = ({ setIsDropdownOpen }: { setIsDropdownOpen: (v: boolean) => void }) => {
    const addOrCopyTokenAction = (token: Token | VToken | VhToken) => () => {
      if (isUserConnected) {
        addTokenToWallet(token);
      } else {
        copyToClipboard(token.address);
      }
      setIsDropdownOpen(false);
    };

    return (
      <>
        {tokens.map(token => (
          <TokenDropdownOption
            key={token.address}
            type="button"
            onClick={addOrCopyTokenAction(token)}
            token={token}
            label={token.symbol}
          />
        ))}
      </>
    );
  };

  return (
    <Dropdown
      className={className}
      optionsDom={optionsDom}
      menuTitle={
        isUserConnected
          ? t('interactive.addToWallet.modalTitle')
          : t('interactive.copy.address.modalTitle')
      }
    >
      {({ isDropdownOpen, handleToggleDropdown }) => (
        <DropdownToggleButton handleToggleDropdown={handleToggleDropdown}>
          <Icon
            name={isUserConnected ? 'wallet' : 'copy'}
            className={cn(
              'justify-center h-5 w-5',
              isUserConnected && 'ml-0.5',
              isDropdownOpen && 'text-blue',
            )}
          />
        </DropdownToggleButton>
      )}
    </Dropdown>
  );
};
