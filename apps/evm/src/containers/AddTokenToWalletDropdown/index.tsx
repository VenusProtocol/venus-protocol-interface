import { Dropdown } from 'components/Dropdown';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { useTranslation } from 'libs/translations';
import { useAddTokenToWallet } from 'libs/wallet';
import type { VToken } from 'types';
import type { ButtonProps } from '../../components/Button';
import { Icon } from '../../components/Icon';

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

  const options = [
    {
      label: (
        <span
          className="flex flex-row gap-2"
          onClick={() => addTokenToWallet(vToken.underlyingToken)}
        >
          <img
            className="w-5 max-w-none flex-none"
            src={vToken.underlyingToken.asset}
            alt={vToken.underlyingToken.symbol}
          />
          {vToken.underlyingToken.symbol}
        </span>
      ),
      value: vToken.underlyingToken.symbol,
    },
    {
      label: (
        <span className="flex flex-row gap-2" onClick={() => addTokenToWallet(vToken)}>
          {vToken.asset && (
            <img className="w-5 max-w-none flex-none" src={vToken.asset} alt={vToken.symbol} />
          )}
          {vToken.symbol}
        </span>
      ),
      value: vToken.symbol,
    },
  ];

  return (
    <Dropdown
      className={className}
      options={options}
      value={''}
      onChange={() => {}}
      buttonClassName="flex justify-center items-center bg-background/40 p-1 h-8 w-8"
    >
      {({ isDropdownOpened }) => <Icon name="wallet" className="h-6 w-6 text-inherit" />}
    </Dropdown>
  );
};
