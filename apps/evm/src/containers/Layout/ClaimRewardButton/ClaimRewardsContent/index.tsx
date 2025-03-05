import { PrimaryButton, cn } from '@venusprotocol/ui';
import { Checkbox } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwitchChain } from 'containers/SwitchChain';
import { handleError } from 'libs/errors';
import { useTranslation } from 'react-i18next';
import TEST_IDS from '../../testIds';
import { ExternalRewardGroup } from '../ExternalRewardGroup';
import { InternalRewardGroup } from '../InternalRewardGroup';
import { RewardGroupFrame } from '../RewardGroupFrame';
import type { ExternalRewardsGroup, InternalRewardsGroup } from '../types';

interface ClaimRewardsContentProps {
  isClaimingRewards: boolean;
  internalRewardsGroups: InternalRewardsGroup[];
  externalRewardsGroups: ExternalRewardsGroup[];
  onCloseModal: () => void;
  onClaimReward: () => Promise<unknown>;
  onToggleAllGroups: () => void;
  onToggleGroup: (toggledGroup: InternalRewardsGroup) => void;
}
export const ClaimRewardsContent = ({
  isClaimingRewards,
  internalRewardsGroups,
  externalRewardsGroups,
  onCloseModal,
  onClaimReward,
  onToggleAllGroups,
  onToggleGroup,
}: ClaimRewardsContentProps) => {
  const { t } = useTranslation();
  const handleClaimReward = async () => {
    try {
      await onClaimReward();
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
          className={cn(hasExternalRewards && 'border-b pb-4 mb-4 md:mb-0')}
          title={t('claimReward.modal.rewards')}
          claimComponent={
            <Checkbox
              onChange={onToggleAllGroups}
              value={internalRewardsGroups.every(group => group.isChecked || group.isDisabled)}
              data-testid={TEST_IDS.claimRewardSelectAllCheckbox}
            />
          }
        >
          <div data-testid={TEST_IDS.claimRewardBreakdown}>
            {internalRewardsGroups.map(group => (
              <InternalRewardGroup
                group={group}
                onCheckChange={() => onToggleGroup(group)}
                key={`claim-reward-modal-reward-group-${group.id}`}
              />
            ))}
          </div>

          <div className="w-full mt-4">
            <ConnectWallet>
              <SwitchChain>
                <PrimaryButton
                  className="w-full"
                  onClick={handleClaimReward}
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
          <div data-testid={TEST_IDS.claimExternalRewardBreakdown}>
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
