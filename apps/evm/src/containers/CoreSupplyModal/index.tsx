import { ActiveTabPathProvider } from 'components';
import { CoreFormModalTitle, type CoreFormModalTitleProps } from 'containers/CoreFormModalTitle';
import { MarketFormModal } from 'containers/MarketFormModal';
import { useChain } from 'hooks/useChain';
import type { Asset } from 'types';

export interface CoreSupplyModalProps {
  asset: Asset;
  surface: CoreFormModalTitleProps['surface'];
  onClose: () => void;
}

export const CoreSupplyModal: React.FC<CoreSupplyModalProps> = ({ asset, surface, onClose }) => {
  const { corePoolComptrollerContractAddress } = useChain();

  return (
    <ActiveTabPathProvider>
      <MarketFormModal
        title={<CoreFormModalTitle asset={asset} side="supply" surface={surface} />}
        asset={asset}
        poolComptrollerAddress={corePoolComptrollerContractAddress}
        initialActiveTabId="supply"
        visibleTabIds={['supply', 'withdraw']}
        disableIntegratedSwap
        onClose={onClose}
      />
    </ActiveTabPathProvider>
  );
};
