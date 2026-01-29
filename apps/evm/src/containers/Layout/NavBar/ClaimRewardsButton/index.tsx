import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';

import { type Claim, useClaimRewards } from 'clients/api';
import { type ButtonProps, Icon, Modal } from 'components';
import { useChain } from 'hooks/useChain';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { formatCentsToReadableValue } from 'utilities';

import { useBreakpointUp } from 'hooks/responsive';
import TEST_IDS from '../../testIds';
import { NavButtonWrapper } from '../NavButtonWrapper';
import { ClaimRewardsContent } from './ClaimRewardsContent';
import type { InternalRewardsGroup } from './types';
import useGetGroups from './useGetGroups';

export interface ClaimRewardsButtonProps extends Omit<ButtonProps, 'onClick' | 'variant'> {
  variant?: 'primary' | 'secondary';
}

export const ClaimRewardsButton: React.FC<ClaimRewardsButtonProps> = ({ ...otherProps }) => {
  const { accountAddress } = useAccountAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chain = useChain();

  const [uncheckedGroupIds, setUncheckedGroupIds] = useState<string[]>([]);
  const { internalRewardsGroups, externalRewardsGroups } = useGetGroups({
    uncheckedGroupIds,
  });

  const { mutateAsync: claimRewards, isPending: isClaimingRewards } = useClaimRewards();

  const handleClaimRewards = async () => {
    if (!accountAddress) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    // Extract all claims from checked groups
    const claims = internalRewardsGroups.reduce<Claim[]>(
      (acc, group) => (group.isChecked && !group.isDisabled ? acc.concat(group.claims) : acc),
      [],
    );

    return claimRewards({
      claims,
    });
  };

  const handleOpenModal = () => {
    // Select all claimable rewards
    setUncheckedGroupIds([]);
    // Open modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const toggleGroup = (toggledGroup: InternalRewardsGroup) =>
    setUncheckedGroupIds(currentUncheckedGroupIds =>
      toggledGroup.isChecked
        ? [...currentUncheckedGroupIds, toggledGroup.id]
        : currentUncheckedGroupIds.filter(
            currentCheckedGroupName => currentCheckedGroupName !== toggledGroup.id,
          ),
    );

  const toggleAllGroups = () =>
    setUncheckedGroupIds(currentUncheckedGroupIds =>
      currentUncheckedGroupIds.length > 0 ? [] : internalRewardsGroups.map(group => group.id),
    );

  const { t } = useTranslation();
  const isMdOrUp = useBreakpointUp('md');

  const allRewardGroups = useMemo(
    () => [...internalRewardsGroups, ...externalRewardsGroups],
    [internalRewardsGroups, externalRewardsGroups],
  );

  const totalRewardsCents = useMemo(
    () =>
      allRewardGroups.reduce<BigNumber>(
        (groupsAcc, g) =>
          groupsAcc.plus(
            g.pendingRewards.reduce<BigNumber>(
              (acc, r) => acc.plus(r.rewardAmountCents || new BigNumber(0)),
              new BigNumber(0),
            ),
          ),
        new BigNumber(0),
      ),
    [allRewardGroups],
  );

  if (!allRewardGroups.length) {
    return null;
  }

  const titleDom = (
    <div className="flex items-center">
      <img src={chain.iconSrc} alt={chain.name} className="mr-3 w-6" />

      {t('claimReward.modal.title', {
        chainName: chain.name,
      })}
    </div>
  );

  const readableClaimableRewards = formatCentsToReadableValue({
    value: totalRewardsCents,
  });

  return (
    <>
      <NavButtonWrapper
        data-testid={TEST_IDS.claimRewardOpenModalButton}
        onClick={handleOpenModal}
        {...otherProps}
      >
        <div className="flex items-center gap-x-2">
          <Icon name="gift" className="text-yellow" />

          <span>{readableClaimableRewards}</span>
        </div>
      </NavButtonWrapper>

      <Modal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        title={titleDom}
        noHorizontalPadding={!isMdOrUp}
      >
        <ClaimRewardsContent
          isClaimingRewards={isClaimingRewards}
          internalRewardsGroups={internalRewardsGroups}
          externalRewardsGroups={externalRewardsGroups}
          onCloseModal={handleCloseModal}
          onClaimRewards={handleClaimRewards}
          onToggleGroup={toggleGroup}
          onToggleAllGroups={toggleAllGroups}
        />
      </Modal>
    </>
  );
};
