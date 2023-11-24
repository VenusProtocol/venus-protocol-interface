import BigNumber from 'bignumber.js';
import { ButtonProps, Checkbox, Modal, PrimaryButton } from 'components';
import { VError, displayMutationError } from 'packages/errors';
import { useLunaUstWarning } from 'packages/lunaUstWarning';
import { useTranslation } from 'packages/translations';
import { useMemo, useState } from 'react';
import { formatCentsToReadableValue } from 'utilities';

import { Claim, useClaimRewards } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

import TEST_IDS from '../testIds';
import { RewardGroup } from './RewardGroup';
import { Group } from './types';
import useGetGroups from './useGetGroups';

export interface ClaimRewardButtonUiProps extends ClaimRewardButtonProps {
  isModalOpen: boolean;
  isClaimingRewards: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onClaimReward: () => Promise<unknown>;
  onToggleAllGroups: () => void;
  onToggleGroup: (toggledGroup: Group) => void;
  chainLogoSrc: string;
  chainName: string;
  groups: Group[];
}

export const ClaimRewardButtonUi: React.FC<ClaimRewardButtonUiProps> = ({
  isModalOpen,
  isClaimingRewards,
  onOpenModal,
  onCloseModal,
  onClaimReward,
  onToggleAllGroups,
  onToggleGroup,
  groups,
  chainLogoSrc,
  chainName,
  ...otherButtonProps
}) => {
  const { t } = useTranslation();

  const totalRewardsCents = useMemo(
    () =>
      groups &&
      groups.reduce<BigNumber>(
        (groupsAcc, g) =>
          groupsAcc.plus(
            g.pendingRewards.reduce<BigNumber>(
              (acc, r) => acc.plus(r.rewardAmountCents || new BigNumber(0)),
              new BigNumber(0),
            ),
          ),
        new BigNumber(0),
      ),
    [groups],
  );

  const handleClaimReward = async () => {
    try {
      await onClaimReward();
      onCloseModal();
    } catch (error) {
      displayMutationError({ error });
    }
  };

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
        {t('claimReward.openModalButton.label', {
          rewardAmount: formatCentsToReadableValue({
            value: totalRewardsCents,
          }),
        })}
      </PrimaryButton>

      <Modal
        isOpen={isModalOpen}
        handleClose={onCloseModal}
        title={
          <div className="flex items-center">
            <img src={chainLogoSrc} alt={chainName} className="mr-3 w-6" />

            {t('claimReward.modal.title', {
              chainName,
            })}
          </div>
        }
      >
        <>
          <div className="mb-4 flex items-center justify-between border-b border-lightGrey pb-4">
            <p className="text-lg">{t('claimReward.modal.selectAll')}</p>

            <Checkbox
              onChange={onToggleAllGroups}
              value={groups.every(group => group.isChecked || group.isDisabled)}
              data-testid={TEST_IDS.claimRewardSelectAllCheckbox}
            />
          </div>

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
            className="w-full"
            disabled={isSubmitDisabled}
            data-testid={TEST_IDS.claimRewardSubmitButton}
            loading={isClaimingRewards}
          >
            {isSubmitDisabled
              ? t('claimReward.modal.claimButton.disabledLabel')
              : t('claimReward.modal.claimButton.enabledLabel')}
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

  const chainMetadata = useGetChainMetadata();

  const { userHasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useLunaUstWarning();

  const [uncheckedGroupIds, setUncheckedGroupIds] = useState<string[]>([]);
  const groups = useGetGroups({
    uncheckedGroupIds,
  });

  const { mutateAsync: claimRewards, isLoading: isClaimingRewards } = useClaimRewards();

  const handleClaimReward = async () => {
    if (!accountAddress) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    // Extract all claims from checked groups
    const claims = groups.reduce<Claim[]>(
      (acc, group) => (group.isChecked ? acc.concat(group.claims) : acc),
      [],
    );

    return claimRewards({
      claims,
      accountAddress,
    });
  };

  const handleOpenModal = () => {
    // Block action if user has LUNA or UST enabled as collateral
    if (userHasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    // Select all claimable rewards
    setUncheckedGroupIds([]);
    // Open modal
    setIsModalOpen(true);
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

  const handleToggleAllGroups = () =>
    setUncheckedGroupIds(currentUncheckedGroupIds =>
      currentUncheckedGroupIds.length > 0 ? [] : groups.map(group => group.id),
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
      onToggleAllGroups={handleToggleAllGroups}
      chainLogoSrc={chainMetadata.logoSrc}
      chainName={chainMetadata.name}
      {...props}
    />
  );
};

export default ClaimRewardButton;
