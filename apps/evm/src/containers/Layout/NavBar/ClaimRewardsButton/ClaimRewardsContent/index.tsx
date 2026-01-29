import { PrimaryButton, cn } from '@venusprotocol/ui';
import { Checkbox } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwitchChain } from 'containers/SwitchChain';
import { handleError } from 'libs/errors';
import { useTranslation } from 'react-i18next';
import TEST_IDS from '../../../testIds';
import { ExternalRewardGroup } from '../ExternalRewardGroup';
import { InternalRewardGroup } from '../InternalRewardGroup';
import { RewardGroupFrame } from '../RewardGroupFrame';
import type { ExternalRewardsGroup, InternalRewardsGroup } from '../types';

interface ClaimRewardsContentProps {
  isClaimingRewards: boolean;
  internalRewardsGroups: InternalRewardsGroup[];
  externalRewardsGroups: ExternalRewardsGroup[];
  onCloseModal: () => void;
  onClaimRewards: () => Promise<unknown>;
  onToggleAllGroups: () => void;
  onToggleGroup: (toggledGroup: InternalRewardsGroup) => void;
}

export const ClaimRewardsContent = ({
  isClaimingRewards,
  internalRewardsGroups,
  externalRewardsGroups,
  onCloseModal,
  onClaimRewards,
  onToggleAllGroups,
  onToggleGroup,
}: ClaimRewardsContentProps) => {
  const { t } = useTranslation();

  const handleClaimRewards = async () => {
    try {
      await onClaimRewards();
      onCloseModal();
    } catch (error) {
      handleError({ error });
    }
  };

  const isSubmitDisabled = !internalRewardsGroups.some(group => group.isChecked);
  const hasInternalRewards = internalRewardsGroups.length > 0;
  const hasExternalRewards = externalRewardsGroups.length > 0;

  return (
    <div
      className="flex flex-col md:gap-4 md:rounded-3xl md:mx-4"
      onClick={e => e.stopPropagation()}
    >
      {hasInternalRewards && (
        <RewardGroupFrame
          className={cn(hasExternalRewards && 'border-b pb-6 mb-4 md:mb-0')}
          title={t('claimReward.modal.rewards')}
          claimComponent={
            <Checkbox
              onChange={onToggleAllGroups}
              value={internalRewardsGroups.every(group => group.isChecked || group.isDisabled)}
              data-testid={TEST_IDS.claimRewardSelectAllCheckbox}
            />
          }
        >
          <div data-testid={TEST_IDS.claimRewardBreakdown} className="space-y-4">
            {internalRewardsGroups.map(group => (
              <InternalRewardGroup
                group={group}
                onCheckChange={() => onToggleGroup(group)}
                key={`claim-reward-modal-reward-group-${group.id}`}
              />
            ))}
          </div>

          <div className="w-full mt-4">
            <ConnectWallet analyticVariant="claim_rewards_modal">
              <SwitchChain>
                <PrimaryButton
                  className="w-full"
                  onClick={handleClaimRewards}
                  disabled={isSubmitDisabled}
                  data-testid={TEST_IDS.claimRewardSubmitButton}
                  loading={isClaimingRewards}
                >
                  {isSubmitDisabled
                    ? t('claimReward.modal.claimButton.disabledLabel')
                    : t('claimReward.modal.claimButton.enabledLabel')}
                </PrimaryButton>
              </SwitchChain>
            </ConnectWallet>
          </div>
        </RewardGroupFrame>
      )}

      {hasExternalRewards && (
        <RewardGroupFrame title={t('claimReward.modal.externalRewards')}>
          <div data-testid={TEST_IDS.claimExternalRewardBreakdown} className="space-y-4">
            {externalRewardsGroups.map(group => (
              <ExternalRewardGroup
                group={group}
                key={`claim-reward-modal-external-reward-group-${group.id}`}
              />
            ))}
          </div>
        </RewardGroupFrame>
      )}
    </div>
  );
};
