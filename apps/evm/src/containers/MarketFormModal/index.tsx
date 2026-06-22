import type { Address } from 'viem';

import { Modal, type ModalProps, ProtectionModeIndicator } from 'components';
// TODO: import OperationForm from containers once it is stable. There's ongoing work happening on
// it, so moving it now could generate conflicts
import { OperationForm, type OperationFormProps } from 'pages/Market/OperationForm';
import type { Asset } from 'types';

export interface MarketFormModalProps {
  asset: Asset;
  poolComptrollerAddress: Address;
  onClose: ModalProps['handleClose'];
  onSubmitSuccess?: OperationFormProps['onSubmitSuccess'];
}

export const MarketFormModal: React.FC<MarketFormModalProps> = ({
  asset,
  poolComptrollerAddress,
  onClose,
  onSubmitSuccess,
}) => (
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
    <OperationForm
      vToken={asset.vToken}
      poolComptrollerAddress={poolComptrollerAddress}
      onSubmitSuccess={onSubmitSuccess}
    />
  </Modal>
);
