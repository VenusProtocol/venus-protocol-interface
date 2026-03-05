import { Card, Modal, type Order, Table } from 'components';
import { EModeGroupList } from 'containers/EModeGroupList';
import { useState } from 'react';
import type { EModeGroup } from 'types';
import { ModeCard } from './ModeCard';
import type { ExtendedEModeAssetSettings, ModeProps } from './types';
import { useColumns } from './useColumns';

export * from './types';

export const Mode: React.FC<ModeProps> = ({ title, eModeAssetSettings, pool }) => {
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
        <div className="text-p2s px-6">{title}</div>

        {/* Card view */}
        <ModeCard
          className="space-y-6 px-6 md:hidden lg:block 2xl:hidden"
          eModeAssetSettings={eModeAssetSettings}
          columns={columns}
          order={initialOrder}
          rowOnClick={(_e, eModeGroup) => setSelectedEModeGroup(eModeGroup)}
        />

        {/* Table  view */}
        <div className="px-2 hidden md:block lg:hidden 2xl:block">
          <Table
            variant="secondary"
            columns={columns}
            data={eModeAssetSettings}
            rowKeyExtractor={row => row.eModeGroup.name}
            rowOnClick={(_e, row) => setSelectedEModeGroup(row.eModeGroup)}
            initialOrder={initialOrder}
            size="sm"
          />
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
