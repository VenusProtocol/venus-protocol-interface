import { useGetPrimeToken } from 'clients/api';
import { Button, type ButtonProps } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal } from 'libs/wallet';
import { cn, truncateAddress } from 'utilities';

import { PrimeButton } from './PrimeButton';

export const ConnectButton: React.FC<
  Omit<ButtonProps, 'isAccountPrime' | 'accountAddress' | 'loading' | 'onClick'>
> = ({ className, ...otherProps }) => {
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();
  const { t } = useTranslation();

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken({
    accountAddress,
  });
  const isAccountPrime = !!getPrimeTokenData?.exists;

  if (isGetPrimeTokenLoading) {
    return null;
  }

  const props = {
    onClick: openAuthModal,
    className: cn('', className),
  };

  if (accountAddress && isAccountPrime) {
    return <PrimeButton accountAddress={accountAddress} {...props} {...otherProps} />;
  }

  return (
    <Button variant={accountAddress ? 'secondary' : 'primary'} {...props} {...otherProps}>
      {accountAddress ? <>{truncateAddress(accountAddress)}</> : t('connectButton.title')}
    </Button>
  );
};
