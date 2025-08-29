import { Modal } from 'components';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import type { Address } from 'viem';
import { BlockingPosition } from './BlockingPosition';

export interface BlockingPositionModalProps {
  onClose: () => void;
  eModeGroupName: string;
  poolComptrollerAddress: Address;
  blockingAssets: Asset[];
}

export const BlockingPositionModal: React.FC<BlockingPositionModalProps> = ({
  onClose,
  eModeGroupName,
  poolComptrollerAddress,
  blockingAssets,
}) => {
  const { t, Trans } = useTranslation();

  return (
    <Modal isOpen handleClose={onClose} title={t('pool.eMode.group.cannotEnable.modal.title')}>
      <>
        <p className="text-grey text-sm mb-3">
          <Trans
            i18nKey="pool.eMode.group.cannotEnable.modal.description"
            values={{
              eModeGroupName,
            }}
            components={{
              WhiteText: <span className="text-offWhite" />,
            }}
          />
        </p>

        {blockingAssets.map(asset => (
          <BlockingPosition
            key={asset.vToken.address}
            asset={asset}
            poolComptrollerAddress={poolComptrollerAddress}
          />
        ))}
      </>
    </Modal>
  );
};
