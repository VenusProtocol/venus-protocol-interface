import { Modal, type ModalProps, Tabs, TokenIcon } from 'components';
import { VaultName } from 'containers/VaultCard/VaultName';
import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useTranslation } from 'libs/translations';
import { VaultCategory, type VenusVault } from 'types';
import { StakeForm } from './StakeForm';
import { WithdrawTab } from './WithdrawTab';

export interface VenusVaultModalProps {
  vault: VenusVault;
  handleClose: () => void;
  initialMode?: 'deposit' | 'withdraw';
  isOpen: boolean;
  hidePrimeLeaderboardLink?: boolean;
  title?: ModalProps['title'];
}

export const VenusVaultModal: React.FC<VenusVaultModalProps> = ({
  vault,
  handleClose,
  isOpen,
  hidePrimeLeaderboardLink,
  title,
}) => {
  const { t } = useTranslation();
  const { isLite } = useInterfaceMode();

  const tabs = [
    {
      id: 'stake',
      title: t('vault.modals.stakeTab'),
      content: (
        <StakeForm
          vault={vault}
          onClose={handleClose}
          hidePrimeLeaderboardLink={hidePrimeLeaderboardLink}
        />
      ),
    },
    {
      id: 'withdraw',
      title: t('vault.modals.withdrawTab'),
      content: <WithdrawTab vault={vault} onClose={handleClose} />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={
        title ??
        (isLite && vault.category === VaultCategory.GOVERNANCE ? (
          <span className="inline-flex items-center gap-x-2">
            <TokenIcon token={vault.stakedToken} />
            {t('lite.formTitle', {
              symbol: vault.stakedToken.symbol,
              marketName: t('lite.markets.xvsVault'),
            })}
          </span>
        ) : (
          <VaultName vault={vault} />
        ))
      }
    >
      <Tabs tabs={tabs} variant={isLite ? 'secondary' : 'primary'} />
    </Modal>
  );
};
