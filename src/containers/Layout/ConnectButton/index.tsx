import { Button, ButtonProps } from 'components';
import { useTranslation } from 'translation';
import { truncateAddress } from 'utilities';

import { useGetIsAddressPrime } from 'clients/api';
import { useAuth } from 'context/AuthContext';

import { PrimeButton } from './PrimeButton';

export interface ConnectButtonUiProps extends ButtonProps {
  isAccountPrime: boolean;
  accountAddress?: string;
}

export const ConnectButtonUi: React.FC<ConnectButtonUiProps> = ({
  accountAddress,
  isAccountPrime,
  loading,
  ...otherProps
}) => {
  const { t } = useTranslation();

  if (loading) {
    return null;
  }

  if (accountAddress && isAccountPrime) {
    return <PrimeButton accountAddress={accountAddress} {...otherProps} />;
  }

  return (
    <Button variant={accountAddress ? 'secondary' : 'primary'} {...otherProps}>
      {accountAddress ? <>{truncateAddress(accountAddress)}</> : t('connectButton.title')}
    </Button>
  );
};

export const ConnectButton: React.FC<
  Omit<ConnectButtonUiProps, 'isAccountPrime' | 'accountAddress' | 'loading'>
> = props => {
  const { accountAddress, openAuthModal } = useAuth();

  const { data: getIsAddressPrimeData, isLoading: isGetIsAddressPrimeLoading } =
    useGetIsAddressPrime({
      accountAddress,
    });
  const isAccountPrime = !!getIsAddressPrimeData?.isPrime;

  return (
    <ConnectButtonUi
      accountAddress={accountAddress}
      isAccountPrime={isAccountPrime}
      loading={isGetIsAddressPrimeLoading}
      onClick={openAuthModal}
      {...props}
    />
  );
};

export default ConnectButton;
