/** @jsxImportSource @emotion/react */
import { ContractReceipt } from 'ethers';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'translation';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { ButtonProps, PrimaryButton } from '../../Button';
import { Modal } from '../../Modal';
import TEST_IDS from '../testIds';
import { RewardGroup } from './RewardGroup';
import { Group } from './types';
import useGetGroups from './useGetGroups';

export interface ClaimRewardButtonUiProps extends ClaimRewardButtonProps {
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onClaimReward: () => Promise<ContractReceipt>;
  onToggleGroup: (toggledGroup: Group) => void;
  groups: Group[];
}

export const ClaimRewardButtonUi: React.FC<ClaimRewardButtonUiProps> = ({
  isModalOpen,
  onOpenModal,
  onCloseModal,
  onClaimReward,
  onToggleGroup,
  groups,
  ...otherButtonProps
}) => {
  const { t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const handleClaimReward = () =>
    handleTransactionMutation({
      mutate: async () => {
        const contractReceipt = await onClaimReward();
        onCloseModal();
        return contractReceipt;
      },
      successTransactionModalProps: contractReceipt => ({
        title: t('claimReward.successfulTransactionModal.title'),
        content: t('claimReward.successfulTransactionModal.message'),
        transactionHash: contractReceipt.transactionHash,
      }),
    });

  const isSubmitDisabled = !groups.some(group => group.isChecked);

  if (!groups.length) {
    return null;
  }

  return (
    <>
      <PrimaryButton
        data-testid={TEST_IDS.claimRewardOpenModalButton}
        onClick={onOpenModal}
        {...otherButtonProps}
      >
        {t('claimReward.openModalButton.label')}
      </PrimaryButton>

      <Modal
        isOpen={isModalOpen}
        handleClose={onCloseModal}
        title={<h4>{t('claimReward.modal.title')}</h4>}
      >
        <>
          <div data-testid={TEST_IDS.claimRewardBreakdown}>
            {groups.map(group => (
              <RewardGroup
                group={group}
                onCheckChange={() => onToggleGroup(group)}
                key={`claim-reward-modal-reward-group-${group.name}`}
              />
            ))}
          </div>

          <PrimaryButton
            onClick={handleClaimReward}
            fullWidth
            disabled={isSubmitDisabled}
            data-testid={TEST_IDS.claimRewardSubmitButton}
          >
            {isSubmitDisabled
              ? t('claimReward.claimButton.disabledLabel')
              : t('claimReward.claimButton.enabledLabel')}
          </PrimaryButton>
        </>
      </Modal>
    </>
  );
};

export type ClaimRewardButtonProps = Omit<ButtonProps, 'onClick'>;

export const ClaimRewardButton: React.FC<ClaimRewardButtonProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const [uncheckedGroupNames, setUncheckedGroupNames] = useState<string[]>([]);
  const groups = useGetGroups({
    uncheckedGroupNames,
  });

  // TODO: wire up (VEN-932)
  const handleClaimReward = async () => fakeContractReceipt;

  const handleOpenModal = () => {
    // Block action if user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    return setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleToggleGroup = (toggledGroup: Group) =>
    setUncheckedGroupNames(currentUncheckedGroupNames =>
      toggledGroup.isChecked
        ? [...currentUncheckedGroupNames, toggledGroup.name]
        : currentUncheckedGroupNames.filter(
            currentCheckedGroupName => currentCheckedGroupName !== toggledGroup.name,
          ),
    );

  return (
    <ClaimRewardButtonUi
      groups={groups}
      isModalOpen={isModalOpen}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onClaimReward={handleClaimReward}
      onToggleGroup={handleToggleGroup}
      {...props}
    />
  );
};

export default ClaimRewardButton;
