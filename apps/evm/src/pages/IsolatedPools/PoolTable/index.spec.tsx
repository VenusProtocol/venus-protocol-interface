import type Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { chainMetadata } from '@venusprotocol/registry';
import { useGetPools } from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { ChainId } from 'types';

import PoolTable from '.';

vi.mock('hooks/useGetChainMetadata');

describe('PoolTable', () => {
  beforeEach(() => {
    (useGetChainMetadata as Vi.Mock).mockImplementation(() => chainMetadata[ChainId.BSC_TESTNET]);
  });

  it('renders without crashing', () => {
    renderComponent(<PoolTable />);
  });

  it('filters out the core pool', () => {
    (useGetPools as Vi.Mock).mockImplementation(() => ({
      data: {
        pools: [
          {
            ...poolData[0],
            comptrollerContractAddress:
              chainMetadata[ChainId.BSC_TESTNET].corePoolComptrollerContractAddress,
          },
        ],
      },
    }));

    const { queryByText } = renderComponent(<PoolTable />);

    expect(queryByText(poolData[0].name)).toBeNull();
  });
});
