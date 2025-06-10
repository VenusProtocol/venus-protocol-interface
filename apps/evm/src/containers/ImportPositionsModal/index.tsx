import { AccordionAnimatedContent, Icon, Modal, NoticeInfo, cn } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { InfoSection } from './InfoSection';

export const ImportPositionsModal: React.FC = () => {
  const { t, Trans } = useTranslation();
  const [isOpen, setIsOpen] = useState(
    // false
    // DEV ONLY
    true,
    // END DEV ONLY
  );

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} title={t('importPositionsModal.title')}>
      <>
        <div
          className="px-4 py-5 mb-6 rounded-xl border border-lightGrey"
          onClick={() => setIsAccordionOpen(c => !c)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg">Why Venus?</h2>

            <Icon
              name="arrowUp"
              className={cn('w-6 h-6 text-offWhite', !isAccordionOpen && 'rotate-180')}
            />
          </div>

          <AccordionAnimatedContent isOpen={isAccordionOpen}>
            <div className="mt-4 space-y-4">
              <InfoSection
                title={t('importPositionsModal.infoSection.1.title')}
                description={t('importPositionsModal.infoSection.1.description')}
                iconName="arrowUp" // TODO: update
                iconColorClass="text-blue"
                iconContainerColorClass="bg-blue/10"
              />

              <InfoSection
                title={t('importPositionsModal.infoSection.2.title')}
                description={t('importPositionsModal.infoSection.2.description')}
                iconName="lightning" // TODO: update
                iconColorClass="text-yellow"
                iconContainerColorClass="bg-yellow/10"
              />

              <InfoSection
                title={t('importPositionsModal.infoSection.3.title')}
                description={t('importPositionsModal.infoSection.3.description')}
                iconName="shield" // TODO: update
                iconColorClass="text-green"
                iconContainerColorClass="bg-green/10"
              />
            </div>
          </AccordionAnimatedContent>
        </div>

        <NoticeInfo
          className="text-grey bg-transparent"
          description={
            <Trans
              i18nKey="importPositionsModal.limitNotice"
              components={{
                Number: <span className="font-bold text-offWhite" />,
              }}
            />
          }
        />
      </>
    </Modal>
  );
};
