import { useState } from 'react';
import type { Address } from 'viem';

import { Icon, Tooltip } from 'components';
import { MarketFormModal } from 'containers/MarketFormModal';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';

import type { PrimeRewardSide } from '../UserRewardsCard';
import { CTA_BY_SIDE } from './constants';

export interface MarketActionsButtonProps {
  asset: Asset;
  poolComptrollerAddress: Address;
  side?: PrimeRewardSide;
}

export const MarketActionsButton: React.FC<MarketActionsButtonProps> = ({
  asset,
  poolComptrollerAddress,
  side = 'supply',
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMdOrUp = useBreakpointUp('md');

  const { iconName, tabId } = CTA_BY_SIDE[side];
  const tokenSymbol = asset.vToken.underlyingToken.symbol;

  let label = t('primeLeaderboard.userRewards.cta.supplyTooltip', { tokenSymbol });
  if (side === 'borrow') {
    label = t('primeLeaderboard.userRewards.cta.borrowTooltip', { tokenSymbol });
  } else if (side === 'both') {
    label = t('primeLeaderboard.userRewards.cta.bothTooltip', { tokenSymbol });
  }

  const button = (
    <button
      type="button"
      aria-label={label}
      className="group ml-2 flex shrink-0 cursor-pointer items-center"
      onClick={() => setIsModalOpen(true)}
    >
      <Icon name={iconName} className="text-light-grey transition-colors group-hover:text-white" />
    </button>
  );

  return (
    <>
      {isMdOrUp ? <Tooltip content={label}>{button}</Tooltip> : button}

      {isModalOpen && (
        <MarketFormModal
          asset={asset}
          poolComptrollerAddress={poolComptrollerAddress}
          initialActiveTabId={tabId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
