import { AccordionAnimatedContent, Icon, Modal, NoticeInfo, cn } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { ImportablePositions } from './ImportablePositions';
import type { PositionProps } from './ImportablePositions/Position';
import { InfoSection } from './InfoSection';
import aaveLogoSrc from './aaveLogo.svg';

import { assetData } from '__mocks__/models/asset';

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

  // TODO: fetch
  const aavePositions: PositionProps[] = [
    {
      userSupplyBalanceTokens: assetData[0].userSupplyBalanceTokens,
      token: assetData[0].vToken.underlyingToken,
      currentSupplyApyPercentage: assetData[0].supplyApyPercentage.minus(0.03),
      asset: assetData[0],
    },
  ];

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} title={t('importPositionsModal.title')}>
      <div className="space-y-4">
        <button
          className="px-4 py-5 rounded-xl border border-lightGrey block w-full text-left"
          type="button"
          onClick={() => setIsAccordionOpen(c => !c)}
        >
          <div className="flex gap-x-2 justify-between items-center">
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
                iconName="graph"
                iconColorClass="text-blue"
                iconContainerColorClass="bg-blue/10"
              />

              <InfoSection
                title={t('importPositionsModal.infoSection.2.title')}
                description={t('importPositionsModal.infoSection.2.description')}
                iconName="lightning2"
                iconColorClass="text-yellow"
                iconContainerColorClass="bg-yellow/10"
              />

              <InfoSection
                title={t('importPositionsModal.infoSection.3.title')}
                description={t('importPositionsModal.infoSection.3.description')}
                iconName="shield2"
                iconColorClass="text-green"
                iconContainerColorClass="bg-green/10"
              />
            </div>
          </AccordionAnimatedContent>
        </button>

        <NoticeInfo
          className="text-grey bg-transparent"
          description={
            <Trans
              i18nKey="importPositionsModal.limitNotice"
              components={{
                Number: <span className="text-offWhite" />,
              }}
            />
          }
        />

        <ImportablePositions
          protocolLogoSrc={aaveLogoSrc}
          protocolLogoAlt={t('importPositionsModal.aaveLogoAlt')}
          positions={aavePositions}
        />
      </div>
    </Modal>
  );
};
