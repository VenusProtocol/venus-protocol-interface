import { Card, CompactTableCardList, InfoIcon, Modal, type Order, Table } from 'components';
import { EModeGroupList } from 'containers/EModeGroupList';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { EModeGroup } from 'types';
import type { ExtendedEModeAssetSettings, ModeProps } from './types';
import { useColumns } from './useColumns';

export * from './types';

export const Mode: React.FC<ModeProps> = ({ title, tooltip, eModeAssetSettings, pool }) => {
  const { t } = useTranslation();
  const columns = useColumns();
  const [selectedEModeGroup, setSelectedEModeGroup] = useState<EModeGroup>();
  const closeModal = () => setSelectedEModeGroup(undefined);

  const initialOrder: Order<ExtendedEModeAssetSettings> = {
    orderBy: columns[3],
    orderDirection: 'desc',
  };

  return (
    <>
      <Card className="pt-6 px-0 pb-2 space-y-6">
        <div className="text-p2s px-6 flex items-center gap-1">
          <span>{title}</span>

          {tooltip && <InfoIcon tooltip={tooltip} />}
        </div>

        <div className="px-2">
          {/* Card view */}
          <CompactTableCardList
            className="md:hidden lg:block 2xl:hidden"
            data={eModeAssetSettings}
            columns={columns}
            order={initialOrder}
            rowKeyExtractor={row => `${row.eModeGroup.name}-${row.vToken.address}`}
            renderRowAction={row => (
              <button
                type="button"
                className="cursor-pointer text-right text-blue duration-250 hover:text-blue-hover hover:underline active:text-blue-active"
                onClick={() => setSelectedEModeGroup(row.eModeGroup)}
              >
                {t('market.eModeInfo.link')}
              </button>
            )}
          />

          {/* Table  view */}
          <div className="hidden md:block lg:hidden 2xl:block max-h-104 overflow-y-auto [&_.MuiTableContainer-root]:overflow-visible! [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead_th]:bg-background">
            <Table
              className="border-0"
              variant="secondary"
              columns={columns}
              data={eModeAssetSettings}
              rowKeyExtractor={row => row.eModeGroup.name}
              rowOnClick={(_e, row) => setSelectedEModeGroup(row.eModeGroup)}
              initialOrder={initialOrder}
              size="sm"
            />
          </div>
        </div>
      </Card>

      {selectedEModeGroup && (
        <Modal isOpen handleClose={closeModal}>
          <EModeGroupList
            pool={pool}
            eModeGroups={[selectedEModeGroup]}
            controls={false}
            onEModeAssetSettingsClick={closeModal}
          />
        </Modal>
      )}
    </>
  );
};
