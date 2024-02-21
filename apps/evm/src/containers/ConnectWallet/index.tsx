/** @jsxImportSource @emotion/react */
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal } from 'libs/wallet';

import { Button, Variant } from '../../components/Button';
import { NoticeInfo } from '../../components/Notice';
import { useStyles } from './styles';

export interface PromptProps {
  openAuthModal: () => void;
  connected: boolean;
  buttonVariant?: Variant;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Prompt: React.FC<PromptProps> = ({
  message,
  openAuthModal,
  className,
  children,
  connected,
  buttonVariant = 'secondary',
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  // Render prompt if user aren't connected with any wallet
  if (connected) {
    return <>{children}</>;
  }
  return (
    <div css={styles.container} className={className}>
      {!!message && <NoticeInfo css={styles.notice} description={message} />}

      <Button variant={buttonVariant} className="w-full" onClick={openAuthModal}>
        {t('connectWallet.connectButton')}
      </Button>
    </div>
  );
};

export const ConnectWallet: React.FC<Omit<PromptProps, 'connected' | 'openAuthModal'>> = props => {
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();
  return <Prompt {...props} openAuthModal={openAuthModal} connected={!!accountAddress} />;
};
