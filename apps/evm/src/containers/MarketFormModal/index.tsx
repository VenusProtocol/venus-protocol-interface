import type { Address } from 'viem';

import { Modal, type ModalProps, ProtectionModeIndicator } from 'components';
import { GatedAssetAcknowledgementModal } from 'containers/GatedAssetAcknowledgementModal';
import { MarketForm } from 'containers/MarketForm';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import type { Asset } from 'types';

export interface MarketFormModalProps {
  asset: Asset;
  poolComptrollerAddress: Address;
  onClose: ModalProps['handleClose'];
}

export const MarketFormModal: React.FC<MarketFormModalProps> = ({
  asset,
  poolComptrollerAddress,
  onClose,
}) => {
  const [userChainSettings] = useUserChainSettings();

  if (asset.isGated && !userChainSettings.doNotShowGatedAssetModal) {
    return <GatedAssetAcknowledgementModal onReject={onClose} />;
  }

  return (
    <Modal
      isOpen
      title={
        <span className="inline-flex items-center gap-x-2">
          {asset.isProtectionModeEnabled && (
            <ProtectionModeIndicator
              variant="icon"
              tokenName={asset.vToken.underlyingToken.symbol}
              tokenSupplyPriceCents={asset.tokenSupplyPriceCents}
              tokenBorrowPriceCents={asset.tokenBorrowPriceCents}
            />
          )}
          {asset.vToken.underlyingToken.symbol}
        </span>
      }
      handleClose={onClose}
    >
      <MarketForm
        vToken={asset.vToken}
        poolComptrollerAddress={poolComptrollerAddress}
        onSubmitSuccess={onClose}
      />
    </Modal>
  );
};
