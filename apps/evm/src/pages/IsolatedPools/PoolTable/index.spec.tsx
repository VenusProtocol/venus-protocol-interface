import { CHAIN_METADATA } from '@venusprotocol/web3';
import Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { useGetIsolatedPools } from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { ChainId } from 'types';

import PoolTable from '.';

vi.mock('hooks/useGetChainMetadata');

describe('PoolTable', () => {
  beforeEach(() => {
    (useGetChainMetadata as Vi.Mock).mockImplementation(() => CHAIN_METADATA[ChainId.BSC_TESTNET]);
  });

  it('renders without crashing', () => {
    renderComponent(<PoolTable />);
  });

  it('filters out the core pool', () => {
    (useGetIsolatedPools as Vi.Mock).mockImplementation(() => ({
      data: {
        pools: [
          {
            ...poolData[0],
            comptrollerContractAddress:
              CHAIN_METADATA[ChainId.BSC_TESTNET].corePoolComptrollerContractAddress,
          },
        ],
      },
    }));

    const { queryByText } = renderComponent(<PoolTable />);

    expect(queryByText(poolData[0].name)).toBeNull();
  });
});
