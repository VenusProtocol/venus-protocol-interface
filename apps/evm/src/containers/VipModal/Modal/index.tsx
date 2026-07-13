import { SecondaryButton } from '@venusprotocol/ui';

import { Modal as ModalComp } from 'components';
import { VipTelegramGroupButton } from 'containers/VipTelegramGroupButton';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import backgroundSrc from './background.jpg';

const Modal: React.FC = () => {
  const { t, Trans } = useTranslation();
  const [_, setUserChainSettings] = useUserChainSettings();

  const handleClose = () => {
    setUserChainSettings({
      doNotShowVipModal: true,
    });
  };

  return (
    <ModalComp isOpen>
      <div className="flex flex-col gap-y-6">
        <div className="rounded-lg h-57 overflow-hidden flex items-center justify-center">
          <img src={backgroundSrc} alt={t('vipModal.backgroundAlt')} className="bg-cover" />

          <div className="absolute flex flex-col text-center">
            <span className="text-h7">
              <Trans
                i18nKey="vipModal.illustration.header"
                components={{
                  Highlight: (
                    <span className="text-h4 leading-none bg-[linear-gradient(124deg,#FFF_35%,#FFC50E_65%)] bg-clip-text text-transparent" />
                  ),
                  Linebreak: <br />,
                }}
              />
            </span>
          </div>
        </div>

        <p className="text-p2s text-center text-light-grey">{t('vipModal.description')}</p>

        <div className="flex flex-col gap-y-3">
          <VipTelegramGroupButton onClick={handleClose} />

          <SecondaryButton onClick={handleClose}>
            {t('vipModal.cancelButton.label')}
          </SecondaryButton>
        </div>
      </div>
    </ModalComp>
  );
};

export default Modal;
