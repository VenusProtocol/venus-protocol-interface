import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import type { Pool } from 'types';

import { OperationModal } from '.';

const fakePool: Pool = poolData[0];
const fakeAsset = fakePool.assets[0];

describe('hooks/OperationModal', () => {
  it('renders without crashing', async () => {
    renderComponent(
      <OperationModal
        onClose={vi.fn()}
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
      />,
    );
  });
});
