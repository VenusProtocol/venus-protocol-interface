/** @jsxImportSource @emotion/react */
import { ContractReceipt } from 'ethers';
import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { formatCentsToReadableValue } from 'utilities';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { ButtonProps, PrimaryButton } from '../../Button';
import { Modal } from '../../Modal';
import TEST_IDS from '../testIds';
import { RewardGroup } from './RewardGroup';
import { fakePendingRewardGroups } from './__tests__/fakeData';
import { PendingRewardGroup } from './types';

const isGroupChecked = (checkedGroups: PendingRewardGroup[], group: PendingRewardGroup) =>
  checkedGroups.some(checkedGroup => checkedGroup.groupName === group.groupName);

export interface ClaimRewardButtonUiProps extends ClaimRewardButtonProps {
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onClaimReward: () => Promise<ContractReceipt>;
  onToggleGroup: (toggledGroup: PendingRewardGroup) => void;
  checkedGroups: PendingRewardGroup[];
  groups: PendingRewardGroup[];
}

export const ClaimRewardButtonUi: React.FC<ClaimRewardButtonUiProps> = ({
  isModalOpen,
  onOpenModal,
  onCloseModal,
  onClaimReward,
  onToggleGroup,
  checkedGroups,
  groups,
  ...otherButtonProps
}) => {
  const { t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const { totalRewardAmountCents, readableTotalRewardAmount, readableCheckedRewardAmount } =
    useMemo(() => {
      let rewardAmountCents = 0;
      let checkedRewardAmountCents = 0;

      groups.forEach(pendingRewardGroup => {
        const groupRewardAmountCents = pendingRewardGroup.pendingRewardTokens.reduce(
          (groupReward, pendingRewardToken) => groupReward + pendingRewardToken.amountCents,
          0,
        );
        rewardAmountCents += groupRewardAmountCents;

        if (isGroupChecked(checkedGroups, pendingRewardGroup)) {
          checkedRewardAmountCents += groupRewardAmountCents;
        }
      });

      return {
        totalRewardAmountCents: rewardAmountCents,
        readableTotalRewardAmount: formatCentsToReadableValue({
          value: rewardAmountCents,
          shortenLargeValue: true,
        }),
        readableCheckedRewardAmount: formatCentsToReadableValue({
          value: checkedRewardAmountCents,
          shortenLargeValue: true,
        }),
      };
    }, [groups, checkedGroups]);

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

  const isSubmitDisabled = checkedGroups.length === 0;

  return totalRewardAmountCents ? (
    <>
      <PrimaryButton
        data-testid={TEST_IDS.claimRewardOpenModalButton}
        onClick={onOpenModal}
        {...otherButtonProps}
      >
        {t('claimReward.openModalButton.label', { amount: readableTotalRewardAmount })}
      </PrimaryButton>

      <Modal
        isOpen={isModalOpen}
        handleClose={onCloseModal}
        title={<h4>{t('claimRewardButton.modal.title')}</h4>}
      >
        <>
          <div data-testid={TEST_IDS.claimRewardBreakdown}>
            {groups.map(group => (
              <RewardGroup
                pendingRewardGroup={group}
                isChecked={isGroupChecked(checkedGroups, group)}
                onCheckChange={() => onToggleGroup(group)}
                key={`claim-reward-modal-reward-group-${group.groupName}`}
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
              : t('claimReward.claimButton.enabledLabel', { amount: readableCheckedRewardAmount })}
          </PrimaryButton>
        </>
      </Modal>
    </>
  ) : null;
};

export type ClaimRewardButtonProps = Omit<ButtonProps, 'onClick'>;

export const ClaimRewardButton: React.FC<ClaimRewardButtonProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  // TODO: fetch pending rewards (see VEN-932)
  const isGetRewardAmountLoading = false;
  const pendingRewardGroups = fakePendingRewardGroups;

  const [checkedGroups, setCheckedGroups] = useState<PendingRewardGroup[]>(pendingRewardGroups);

  const handleOpenModal = () => {
    // Block action if user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    return setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleToggleGroup = (toggledGroup: PendingRewardGroup) =>
    setCheckedGroups(currentCheckedGroups =>
      isGroupChecked(currentCheckedGroups, toggledGroup)
        ? currentCheckedGroups.filter(
            checkedGroup => checkedGroup.groupName !== toggledGroup.groupName,
          )
        : [...currentCheckedGroups, toggledGroup],
    );

  // TODO: wire up (see VEN-932)
  const handleClaimReward = async () => fakeContractReceipt;

  return (
    <ClaimRewardButtonUi
      groups={pendingRewardGroups}
      loading={isGetRewardAmountLoading}
      isModalOpen={isModalOpen}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onClaimReward={handleClaimReward}
      checkedGroups={checkedGroups}
      onToggleGroup={handleToggleGroup}
      {...props}
    />
  );
};

export default ClaimRewardButton;
