import { useState } from 'react';
import type { Address } from 'viem';

import { Icon } from 'components';
import { MarketFormModal } from 'containers/MarketFormModal';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';

export interface MarketActionsButtonProps {
  asset: Asset;
  poolComptrollerAddress: Address;
}

export const MarketActionsButton: React.FC<MarketActionsButtonProps> = ({
  asset,
  poolComptrollerAddress,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={t('primeLeaderboard.userRewards.marketActions')}
        className="group ml-2 shrink-0 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Icon
          name="dotShortcut"
          className="text-light-grey transition-colors group-hover:text-white"
        />
      </button>

      {isModalOpen && (
        <MarketFormModal
          asset={asset}
          poolComptrollerAddress={poolComptrollerAddress}
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
