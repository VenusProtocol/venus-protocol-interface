import { useState } from 'react';

import { useGetPools } from 'clients/api';
import { Icon, Modal } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { OperationForm } from 'pages/Market/OperationForm';
import type { Token } from 'types';
import { areAddressesEqual } from 'utilities';

export interface MarketActionsProps {
  token: Token;
}

export const MarketActions: React.FC<MarketActionsProps> = ({ token }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const { data: getPoolsData } = useGetPools({ accountAddress });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const market = getPoolsData?.pools
    .flatMap(pool =>
      pool.assets.map(asset => ({ asset, poolComptrollerAddress: pool.comptrollerAddress })),
    )
    .find(({ asset }) => areAddressesEqual(asset.vToken.underlyingToken.address, token.address));

  if (!market) {
    return undefined;
  }

  return (
    <>
      <button
        type="button"
        aria-label={t('primeLeaderboard.userRewards.marketActions')}
        className="ml-2 shrink-0"
        onClick={() => setIsModalOpen(true)}
      >
        <Icon name="dotShortcut" className="text-light-grey" />
      </button>

      {isModalOpen && (
        <Modal
          isOpen
          title={market.asset.vToken.underlyingToken.symbol}
          handleClose={() => setIsModalOpen(false)}
        >
          <OperationForm
            vToken={market.asset.vToken}
            poolComptrollerAddress={market.poolComptrollerAddress}
            onSubmitSuccess={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};
