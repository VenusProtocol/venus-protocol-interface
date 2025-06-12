import { AccordionAnimatedContent, Icon, Modal as ModalComp, cn } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { ImportablePositions } from './ImportablePositions';
import aaveLogoSrc from './aaveLogo.svg';

import { useMeeClient } from 'libs/wallet';
import { Infos } from './Infos';
import { Notice } from './Notice';
import { useGetProfitableImports } from './useGetProfitableImports';

export const Modal: React.FC = () => {
  const { t } = useTranslation();

  // TODO: use persisted Zustand store
  const [hasClosedModalBefore, setHasClosedModalBefore] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const { supplyPositions: importableSupplyPositions } = useGetProfitableImports();

  // Check smart account and MEE client were successfully initialized
  const { data: getMeeClientData } = useMeeClient();
  const canUserImportPositions = !!getMeeClientData;

  const handleClose = () => setHasClosedModalBefore(true);

  const hasImportablePositions =
    !!importableSupplyPositions &&
    Object.values(importableSupplyPositions).some(positions => positions.length);

  const isModalOpen = !hasClosedModalBefore && canUserImportPositions && hasImportablePositions;

  // Do not render modal if there aren't any importable positions
  if (!hasImportablePositions) {
    return undefined;
  }

  const importablePositionsDom = (
    <>
      {importableSupplyPositions.aave && (
        <ImportablePositions
          protocolLogoSrc={aaveLogoSrc}
          protocolLogoAlt={t('importPositionsModal.aaveLogoAlt')}
          positions={importableSupplyPositions.aave}
        />
      )}

      {/* TODO: add other protocols */}
    </>
  );

  return (
    <ModalComp
      isOpen={isModalOpen}
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
