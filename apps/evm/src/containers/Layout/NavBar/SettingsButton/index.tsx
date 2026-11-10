import { cn } from '@venusprotocol/ui';
import { useState } from 'react';

import { Icon, Modal } from 'components';
import { useTranslation } from 'libs/translations';
import { NavButtonWrapper } from '../NavButtonWrapper';
import { Settings } from '../Settings';

export interface SettingsButtonProps {
  className?: string;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({ className }) => {
  const { t } = useTranslation();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <>
      <NavButtonWrapper
        className={cn('size-9 sm:size-12 lg:hidden', className)}
        aria-label={t('layout.settingsModal.title')}
        onClick={openSettingsModal}
      >
        <Icon name="gearFull" className="text-inherit" />
      </NavButtonWrapper>

      <Modal
        isOpen={isSettingsModalOpen}
        handleClose={closeSettingsModal}
        title={t('layout.settingsModal.title')}
        className="overflow-visible"
      >
        <Settings />
      </Modal>
    </>
  );
};
