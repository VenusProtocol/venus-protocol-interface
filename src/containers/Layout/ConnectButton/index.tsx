import { Button, ButtonProps } from 'components';
import { useTranslation } from 'packages/translations';
import { truncateAddress } from 'utilities';

import { useGetPrimeToken } from 'clients/api';
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

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken({
    accountAddress,
  });
  const isAccountPrime = !!getPrimeTokenData?.exists;

  return (
    <ConnectButtonUi
      accountAddress={accountAddress}
      isAccountPrime={isAccountPrime}
      loading={isGetPrimeTokenLoading}
      onClick={openAuthModal}
      {...props}
    />
  );
};

export default ConnectButton;
