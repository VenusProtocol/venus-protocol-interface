import { cn } from '@venusprotocol/ui';
import { type ButtonProps, Dropdown, Icon } from 'components';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { useTranslation } from 'libs/translations';
import { useAddTokenToWallet } from 'libs/wallet';
import { useCallback } from 'react';
import type { Token, VToken, VhToken } from 'types';
import { DropdownToggleButton } from '../DropdownToggleButton';
import { TokenDropdownOption } from '../TokenDropdownOption';

export interface AddTokenToWalletDropdownProps extends Omit<ButtonProps, 'onClick' | 'variant'> {
  isUserConnected: boolean;
  vToken: VToken;
}

export const AddTokenToWalletDropdown: React.FC<AddTokenToWalletDropdownProps> = ({
  className,
  isUserConnected,
  vToken,
}) => {
  const { addTokenToWallet } = useAddTokenToWallet();
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.address.name'));

  const optionsDom = useCallback(
    ({ setIsDropdownOpen }: { setIsDropdownOpen: (v: boolean) => void }) => {
      const { underlyingToken } = vToken;

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
          <TokenDropdownOption
            type="button"
            onClick={addOrCopyTokenAction(underlyingToken)}
            token={underlyingToken}
            label={underlyingToken.symbol}
          />
          <TokenDropdownOption
            type="button"
            onClick={addOrCopyTokenAction(vToken)}
            token={vToken}
            label={vToken.symbol}
          />
        </>
      );
    },
    [addTokenToWallet, copyToClipboard, isUserConnected, vToken],
  );

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
              isUserConnected && 'ml-[2px]',
              isDropdownOpen && 'text-blue',
            )}
          />
        </DropdownToggleButton>
      )}
    </Dropdown>
  );
};
