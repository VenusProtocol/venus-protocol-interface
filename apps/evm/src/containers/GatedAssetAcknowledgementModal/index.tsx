import { Button, Modal, type ModalProps, Notice, TextButton } from 'components';
import { Link } from 'containers/Link';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';

const BSTOCKS_URL = 'https://www.bstocks.finance/en/prospectus';

export interface GatedAssetAcknowledgementModalProps
  extends Omit<ModalProps, 'title' | 'children' | 'handleClose' | 'isOpen'> {
  onAccept?: () => void;
  onReject?: () => void;
}

export const GatedAssetAcknowledgementModal: React.FC<GatedAssetAcknowledgementModalProps> = ({
  onAccept,
  onReject,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();
  const [userChainSettings, setUserChainSettings] = useUserChainSettings();

  const handleAccept = () => {
    setUserChainSettings({
      doNotShowGatedAssetModal: true,
    });

    onAccept?.();
  };

  const handleReject = () => {
    setUserChainSettings({
      doNotShowGatedAssetModal: false,
    });

    onReject?.();
  };

  return (
    <Modal
      title={t('gatedAssetAcknowledgementModal.title')}
      isOpen={!userChainSettings.doNotShowGatedAssetModal}
      {...otherProps}
    >
      <div className="flex flex-col gap-y-6">
        <Notice
          description={
            <Trans
              i18nKey="gatedAssetAcknowledgementModal.description"
              values={{
                url: BSTOCKS_URL.replace('https://www.', ''),
              }}
              components={{
                LineBreak: <br />,
                Link: <Link href={BSTOCKS_URL} target="_blank" />,
              }}
            />
          }
        />

        <div className="flex flex-col gap-y-3">
          <Button onClick={handleAccept}>
            {t('gatedAssetAcknowledgementModal.acceptButtonLabel')}
          </Button>

          <TextButton onClick={handleReject}>
            {t('gatedAssetAcknowledgementModal.rejectButtonLabel')}
          </TextButton>
        </div>
      </div>
    </Modal>
  );
};
