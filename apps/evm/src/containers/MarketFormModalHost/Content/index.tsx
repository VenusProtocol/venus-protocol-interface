import { useMemo } from 'react';

import { useGetPool } from 'clients/api';
import { MarketFormModal } from 'containers/MarketFormModal';
import { useAccountAddress } from 'libs/wallet';
import { useStore } from '../store';
import type { MarketFormModalRequest } from '../types';

export interface ContentProps {
  request: MarketFormModalRequest;
}

export const Content: React.FC<ContentProps> = ({ request }) => {
  const closeModal = useStore(state => state.closeModal);
  const { accountAddress } = useAccountAddress();

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress: request.poolComptrollerAddress,
    accountAddress,
  });

  const asset = useMemo(
    () =>
      getPoolData?.pool.assets.find(
        poolAsset =>
          poolAsset.vToken.underlyingToken.symbol.toLowerCase() ===
          request.underlyingSymbol.toLowerCase(),
      ),
    [getPoolData?.pool.assets, request.underlyingSymbol],
  );

  if (!asset) {
    return null;
  }

  return (
    <MarketFormModal
      asset={asset}
      poolComptrollerAddress={request.poolComptrollerAddress}
      initialActiveTabId={request.initialActiveTabId}
      onClose={closeModal}
    />
  );
};
