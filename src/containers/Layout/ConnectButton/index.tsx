import { Button, ButtonProps } from 'components';
import { useTranslation } from 'translation';
import { truncateAddress } from 'utilities';

import { useAuth } from 'context/AuthContext';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { PrimeButton } from './PrimeButton';

export interface ConnectButtonUiProps extends ButtonProps {
  isPrime: boolean;
  accountAddress?: string;
}

export const ConnectButtonUi: React.FC<ConnectButtonUiProps> = ({
  accountAddress,
  isPrime,
  ...otherProps
}) => {
  const { t } = useTranslation();

  if (accountAddress && isPrime) {
    return <PrimeButton accountAddress={accountAddress} {...otherProps} />;
  }

  return (
    <Button variant={accountAddress ? 'secondary' : 'primary'} {...otherProps}>
      {accountAddress ? <>{truncateAddress(accountAddress)}</> : t('connectButton.title')}
    </Button>
  );
};

export const ConnectButton: React.FC<
  Omit<ConnectButtonUiProps, 'isPrime' | 'accountAddress'>
> = props => {
  const { accountAddress, openAuthModal, isPrime } = useAuth();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });

  return (
    <ConnectButtonUi
      accountAddress={accountAddress}
      isPrime={isPrimeEnabled && isPrime}
      onClick={openAuthModal}
      {...props}
    />
  );
};

export default ConnectButton;
