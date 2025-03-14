import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';

import { cn } from '@venusprotocol/ui';
import { type Claim, useClaimRewards } from 'clients/api';
import { type ButtonProps, Modal, PrimaryButton } from 'components';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { formatCentsToReadableValue } from 'utilities';

import { useBreakpointUp } from 'hooks/responsive';
import TEST_IDS from '../testIds';
import { ClaimRewardsContent } from './ClaimRewardsContent';
import type { ExternalRewardsGroup, InternalRewardsGroup } from './types';
import useGetGroups from './useGetGroups';

export interface ClaimRewardButtonUiProps extends ClaimRewardButtonProps {
  isModalOpen: boolean;
  isClaimingRewards: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onClaimReward: () => Promise<unknown>;
  onToggleAllGroups: () => void;
  onToggleGroup: (toggledGroup: InternalRewardsGroup) => void;
  chainLogoSrc: string;
  chainName: string;
  venusRewardsGroups: InternalRewardsGroup[];
  externalRewardsGroups: ExternalRewardsGroup[];
}

export const ClaimRewardButtonUi: React.FC<ClaimRewardButtonUiProps> = ({
  isModalOpen,
  isClaimingRewards,
  onOpenModal,
  onCloseModal,
  onClaimReward,
  onToggleAllGroups,
  onToggleGroup,
  venusRewardsGroups,
  externalRewardsGroups,
  chainLogoSrc,
  chainName,
  variant,
  className,
  ...otherButtonProps
}) => {
  const { t } = useTranslation();
  const isMdOrUp = useBreakpointUp('md');

  const allRewardGroups = useMemo(
    () => [...venusRewardsGroups, ...externalRewardsGroups],
    [venusRewardsGroups, externalRewardsGroups],
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
      <img src={chainLogoSrc} alt={chainName} className="mr-3 w-6" />

      {t('claimReward.modal.title', {
        chainName,
      })}
    </div>
  );

  return (
    <>
      <PrimaryButton
        data-testid={TEST_IDS.claimRewardOpenModalButton}
        onClick={onOpenModal}
        className={cn(
          className,
          variant === 'secondary' &&
            'border-transparent bg-offWhite text-background hover:border-transparent hover:bg-grey active:bg-grey active:border-transparent',
        )}
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
        title={titleDom}
        noHorizontalPadding={!isMdOrUp}
      >
        <ClaimRewardsContent
          isClaimingRewards={isClaimingRewards}
          internalRewardsGroups={venusRewardsGroups}
          externalRewardsGroups={externalRewardsGroups}
          onCloseModal={onCloseModal}
          onClaimReward={onClaimReward}
          onToggleGroup={onToggleGroup}
          onToggleAllGroups={onToggleAllGroups}
        />
      </Modal>
    </>
  );
};

export interface ClaimRewardButtonProps extends Omit<ButtonProps, 'onClick' | 'variant'> {
  variant?: 'primary' | 'secondary';
}

export const ClaimRewardButton: React.FC<ClaimRewardButtonProps> = props => {
  const { accountAddress } = useAccountAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chainMetadata = useGetChainMetadata();

  const [uncheckedGroupIds, setUncheckedGroupIds] = useState<string[]>([]);
  const { internalRewardsGroups, externalRewardsGroups } = useGetGroups({
    uncheckedGroupIds,
  });

  const { mutateAsync: claimRewards, isPending: isClaimingRewards } = useClaimRewards();

  const handleClaimReward = async () => {
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
      accountAddress,
    });
  };

  const handleOpenModal = () => {
    // Select all claimable rewards
    setUncheckedGroupIds([]);
    // Open modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleToggleGroup = (toggledGroup: InternalRewardsGroup) =>
    setUncheckedGroupIds(currentUncheckedGroupIds =>
      toggledGroup.isChecked
        ? [...currentUncheckedGroupIds, toggledGroup.id]
        : currentUncheckedGroupIds.filter(
            currentCheckedGroupName => currentCheckedGroupName !== toggledGroup.id,
          ),
    );

  const handleToggleAllGroups = () =>
    setUncheckedGroupIds(currentUncheckedGroupIds =>
      currentUncheckedGroupIds.length > 0 ? [] : internalRewardsGroups.map(group => group.id),
    );

  return (
    <ClaimRewardButtonUi
      venusRewardsGroups={internalRewardsGroups}
      externalRewardsGroups={externalRewardsGroups}
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
