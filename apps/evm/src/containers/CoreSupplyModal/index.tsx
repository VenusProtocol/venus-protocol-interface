import { CoreFormModalTitle } from 'containers/CoreFormModalTitle';
import { MarketFormModal } from 'containers/MarketFormModal';
import { useChain } from 'hooks/useChain';
import type { Asset } from 'types';

export interface CoreSupplyModalProps {
  asset: Asset;
  onClose: () => void;
}

export const CoreSupplyModal: React.FC<CoreSupplyModalProps> = ({ asset, onClose }) => {
  const { corePoolComptrollerContractAddress } = useChain();

  return (
    <MarketFormModal
      title={<CoreFormModalTitle asset={asset} />}
      asset={asset}
      poolComptrollerAddress={corePoolComptrollerContractAddress}
      initialActiveTabId="supply"
      visibleTabIds={['supply', 'withdraw']}
      disableIntegratedSwap
      onClose={onClose}
    />
  );
};
