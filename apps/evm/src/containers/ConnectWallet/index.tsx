import { Button } from 'components/Button';
import { NoticeInfo } from 'components/Notice';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal } from 'libs/wallet';

export interface ConnectWalletProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  children,
  message,
  ...otherProps
}) => {
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { openAuthModal } = useAuthModal();

  const { t } = useTranslation();

  return (
    <div {...otherProps}>
      {isUserConnected ? (
        children
      ) : (
        <>
          {!!message && <NoticeInfo className="mb-8" description={message} />}

          <Button className="w-full" onClick={openAuthModal}>
            {t('connectWallet.connectButton')}
          </Button>
        </>
      )}
    </div>
  );
};
