import { AccordionAnimatedContent, Icon, cn } from 'components';
import { Card } from 'components';
import { useGetProfitableImports } from 'hooks/useGetProfitableImports';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { Infos } from './Infos';
import { Notice } from './Notice';
import { ProtocolPositions } from './ProtocolPositions';
import aaveLogoSrc from './aaveLogo.svg';

export interface ImportablePositionsProps {
  wrapInCard?: boolean;
}

const ImportablePositions: React.FC<ImportablePositionsProps> = ({ wrapInCard = false }) => {
  const { t } = useTranslation();
  const { supplyPositions: importableSupplyPositions } = useGetProfitableImports();

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const importablePositionsDom = (
    <>
      {importableSupplyPositions.aave && (
        <ProtocolPositions
          protocolLogoSrc={aaveLogoSrc}
          protocolLogoAlt={t('importPositionsModal.aaveLogoAlt')}
          positions={importableSupplyPositions.aave}
        />
      )}

      {/* TODO: add other protocols */}
    </>
  );

  let xsDom = (
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
  );

  if (wrapInCard) {
    xsDom = <Card asChild>{xsDom}</Card>;
  }

  const mdUpContentDom = (
    <div className="flex grow gap-x-4 items-start">
      <div
        className={cn(
          'px-4 py-5 space-y-4 rounded-xl border border-lightGrey w-66 sticky',
          wrapInCard ? 'top-4' : 'top-24',
        )}
      >
        <h2 className="text-lg">{t('importPositionsModal.infoSection.title')}</h2>

        <Infos />
      </div>

      <div className="grow space-y-4">{importablePositionsDom}</div>
    </div>
  );

  const mdUpDom = (
    <div className="hidden space-y-4 flex-col md:flex">
      <Notice className="shrink-0" />

      {wrapInCard ? <Card asChild>{mdUpContentDom}</Card> : mdUpContentDom}
    </div>
  );

  return (
    <>
      {/* Mobile display */}
      {xsDom}

      {/* Tablet/desktop display */}
      {mdUpDom}
    </>
  );
};

export default ImportablePositions;
