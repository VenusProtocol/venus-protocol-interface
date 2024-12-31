import { Dropdown } from 'components/Dropdown';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { useTranslation } from 'libs/translations';
import { useAddTokenToWallet } from 'libs/wallet';
import { useCallback } from 'react';
import type { Token, VToken } from 'types';
import { cn } from 'utilities';
import type { ButtonProps } from '../../../../../components/Button';
import { Icon } from '../../../../../components/Icon';
import { TokenDropdownOption } from '../TokenDropdownOption';

export interface AddTokenToWalletDropdownProps extends Omit<ButtonProps, 'onClick' | 'variant'> {
  isUserConnected: boolean;
  vToken: VToken;
}

const generateAddOrCopyTokenOption = (
  token: VToken | Token,
  label: string,
  onClick: () => void,
) => (
  <span
    className="flex items-center justify-start py-3 px-4 text-left text-sm font-semibold flex-row gap-2 grow min-w-[180px] cursor-pointer"
    onClick={onClick}
  >
    <TokenDropdownOption token={token} label={label} />
  </span>
);

export const AddTokenToWalletDropdown: React.FC<AddTokenToWalletDropdownProps> = ({
  className,
  isUserConnected,
  vToken,
}) => {
  const { addTokenToWallet } = useAddTokenToWallet();
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.address.name'));

  const optionsDom = useCallback(
    ({ setIsDropdownOpened }: { setIsDropdownOpened: (v: boolean) => void }) => {
      const { underlyingToken } = vToken;

      const addOrCopyTokenAction = (token: Token | VToken) => () => {
        if (isUserConnected) {
          addTokenToWallet(token);
        } else {
          copyToClipboard(token.address);
        }
        setIsDropdownOpened(false);
      };

      return (
        <>
          {generateAddOrCopyTokenOption(
            underlyingToken,
            underlyingToken.symbol,
            addOrCopyTokenAction(underlyingToken),
          )}
          {generateAddOrCopyTokenOption(vToken, vToken.symbol, addOrCopyTokenAction(vToken))}
        </>
      );
    },
    [addTokenToWallet, copyToClipboard, isUserConnected, vToken],
  );

  return (
    <Dropdown
      className={className}
      buttonClassName="flex justify-center items-center bg-background/40 p-1 h-8 w-8 border-none"
      optionsDom={optionsDom}
      optionClassName="justify-center"
      menuTitle={t('interactive.copy.address.modalTitle')}
    >
      {({ isDropdownOpened }) => (
        <Icon
          name={isUserConnected ? 'wallet' : 'copy'}
          className={cn('justify-center h-5 w-5 ml-[2px]', isDropdownOpened && 'text-blue')}
        />
      )}
    </Dropdown>
  );
};
