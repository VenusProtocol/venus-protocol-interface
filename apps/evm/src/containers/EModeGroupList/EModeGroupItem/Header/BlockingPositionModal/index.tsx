import { Modal } from 'components';
import { useTranslation } from 'libs/translations';
import type { BlockingBorrowPosition } from '../../../types';
import { BlockingPosition } from './BlockingPosition';

export interface BlockingPositionModalProps {
  onClose: () => void;
  eModeGroupName: string;
  blockingBorrowPositions: BlockingBorrowPosition[];
}

export const BlockingPositionModal: React.FC<BlockingPositionModalProps> = ({
  onClose,
  eModeGroupName,
  blockingBorrowPositions,
}) => {
  const { t, Trans } = useTranslation();

  return (
    <Modal isOpen handleClose={onClose} title={t('eModeGroupList.group.cannotEnable.modal.title')}>
      <>
        <p className="text-grey text-sm mb-3">
          <Trans
            i18nKey="eModeGroupList.group.cannotEnable.modal.description"
            values={{
              eModeGroupName,
            }}
            components={{
              WhiteText: <span className="text-offWhite" />,
            }}
          />
        </p>

        {blockingBorrowPositions.map(blockingBorrowPosition => (
          <BlockingPosition
            key={blockingBorrowPosition.token.address}
            {...blockingBorrowPosition}
          />
        ))}
      </>
    </Modal>
  );
};
