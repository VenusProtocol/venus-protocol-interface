/** @jsxImportSource @emotion/react */
import { ContractReceipt } from 'ethers';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'translation';

import { Claim, useClaimRewards } from 'clients/api';
import { useAuth } from 'context/AuthContext';
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
  isClaimingRewards: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onClaimReward: () => Promise<ContractReceipt>;
  onToggleGroup: (toggledGroup: Group) => void;
  groups: Group[];
}

export const ClaimRewardButtonUi: React.FC<ClaimRewardButtonUiProps> = ({
  isModalOpen,
  isClaimingRewards,
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
                key={`claim-reward-modal-reward-group-${group.id}`}
              />
            ))}
          </div>

          <PrimaryButton
            onClick={handleClaimReward}
            fullWidth
            disabled={isSubmitDisabled}
            data-testid={TEST_IDS.claimRewardSubmitButton}
            loading={isClaimingRewards}
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
  const { accountAddress } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const [uncheckedGroupIds, setUncheckedGroupIds] = useState<string[]>([]);
  const groups = useGetGroups({
    uncheckedGroupIds,
  });

  const { mutateAsync: claimRewards, isLoading: isClaimingRewards } = useClaimRewards();

  const handleClaimReward = async () => {
    // Extract all claims from checked groups
    const claims = groups.reduce<Claim[]>(
      (allClaims, group) => (group.isChecked ? allClaims.concat(group.claims) : allClaims),
      [],
    );

    return claimRewards({
      claims,
      accountAddress,
    });
  };

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
    setUncheckedGroupIds(currentUncheckedGroupIds =>
      toggledGroup.isChecked
        ? [...currentUncheckedGroupIds, toggledGroup.id]
        : currentUncheckedGroupIds.filter(
            currentCheckedGroupName => currentCheckedGroupName !== toggledGroup.id,
          ),
    );

  return (
    <ClaimRewardButtonUi
      groups={groups}
      isClaimingRewards={isClaimingRewards}
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
