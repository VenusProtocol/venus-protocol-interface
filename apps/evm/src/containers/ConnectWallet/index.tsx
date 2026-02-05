import { cn } from '@venusprotocol/ui';

import { Button, type ButtonProps, NoticeInfo } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal } from 'libs/wallet';

export interface ConnectWalletProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  analyticVariant?: string;
  buttonClassName?: ButtonProps['className'];
  buttonVariant?: ButtonProps['variant'];
  buttonSize?: ButtonProps['size'];
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  children,
  message,
  analyticVariant,
  buttonClassName,
  buttonVariant,
  buttonSize,
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
            className={cn('w-full', buttonClassName)}
            onClick={handleClick}
            variant={buttonVariant}
            size={buttonSize}
          >
            {t('connectWallet.connectButton')}
          </Button>
        </>
      )}
    </div>
  );
};
