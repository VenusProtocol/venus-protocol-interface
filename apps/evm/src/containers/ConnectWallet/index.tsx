import { Button, type ButtonProps, NoticeInfo } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal } from 'libs/wallet';

export interface ConnectWalletProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  analyticVariant?: string;
  buttonVariant?: ButtonProps['variant'];
  small?: boolean;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  children,
  message,
  analyticVariant,
  buttonVariant,
  small = false,
  ...otherProps
}) => {
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { openAuthModal } = useAuthModal();

  const handleClick = () =>
    openAuthModal({
      analyticVariant,
    });

  const { t } = useTranslation();

  return (
    <div {...otherProps}>
      {isUserConnected ? (
        children
      ) : (
        <>
          {!!message && <NoticeInfo className="mb-8" description={message} />}

          <Button
            className="w-full"
            onClick={handleClick}
            variant={buttonVariant}
            size={small ? 'xs' : 'md'}
          >
            {t('connectWallet.connectButton')}
          </Button>
        </>
      )}
    </div>
  );
};
