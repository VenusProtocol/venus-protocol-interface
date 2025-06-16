import { AccordionAnimatedContent, Icon, Modal as ModalComp, cn } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { ImportablePositions } from './ImportablePositions';
import type { PositionProps } from './ImportablePositions/Position';
import aaveLogoSrc from './aaveLogo.svg';

import { assetData } from '__mocks__/models/asset';
import { Infos } from './Infos';
import { Notice } from './Notice';

export const Modal: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(
    true, // TODO: only display if opportunities were detected and user has never seen this modal before
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

  const importablePositionsDom = (
    <>
      <ImportablePositions
        protocolLogoSrc={aaveLogoSrc}
        protocolLogoAlt={t('importPositionsModal.aaveLogoAlt')}
        positions={aavePositions}
      />

      <ImportablePositions
        protocolLogoSrc={aaveLogoSrc}
        protocolLogoAlt={t('importPositionsModal.aaveLogoAlt')}
        positions={aavePositions}
      />

      <ImportablePositions
        protocolLogoSrc={aaveLogoSrc}
        protocolLogoAlt={t('importPositionsModal.aaveLogoAlt')}
        positions={aavePositions}
      />

      <ImportablePositions
        protocolLogoSrc={aaveLogoSrc}
        protocolLogoAlt={t('importPositionsModal.aaveLogoAlt')}
        positions={aavePositions}
      />

      <ImportablePositions
        protocolLogoSrc={aaveLogoSrc}
        protocolLogoAlt={t('importPositionsModal.aaveLogoAlt')}
        positions={aavePositions}
      />
    </>
  );

  return (
    <ModalComp
      isOpen={isOpen}
      handleClose={handleClose}
      title={t('importPositionsModal.title')}
      className="max-w-[800px]"
    >
      <>
        {/* Mobile display */}
        <div className="space-y-4 md:hidden">
          <button
            className="px-4 py-5 rounded-xl border border-lightGrey block w-full text-left"
            type="button"
            onClick={() => setIsAccordionOpen(c => !c)}
          >
            <div className="flex gap-x-2 justify-between items-center">
              <h2 className="text-lg">{t('importPositionsModal.infoSection.title')}</h2>

              <Icon
                name="arrowUp"
                className={cn('w-6 h-6 text-offWhite', !isAccordionOpen && 'rotate-180')}
              />
            </div>

            <AccordionAnimatedContent isOpen={isAccordionOpen} className="pt-4">
              <Infos />
            </AccordionAnimatedContent>
          </button>

          <Notice />

          {importablePositionsDom}
        </div>

        {/* Tablet/desktop display */}
        <div className="hidden space-y-4 flex-col md:flex">
          <Notice className="shrink-0" />

          <div className="flex grow gap-x-4 items-start">
            <div className="px-4 py-5 space-y-4 rounded-xl border border-lightGrey w-64 sticky top-24">
              <h2 className="text-lg">{t('importPositionsModal.infoSection.title')}</h2>

              <Infos />
            </div>

            <div className="grow space-y-4">{importablePositionsDom}</div>
          </div>
        </div>
      </>
    </ModalComp>
  );
};
