import type { Mock } from 'vitest';

import { renderComponent } from 'testUtils/render';

import { chainMetadata } from '@venusprotocol/chains';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { ChainId } from 'types';

import PoolTable from '.';

vi.mock('hooks/useGetChainMetadata');

describe('PoolTable', () => {
  beforeEach(() => {
    (useGetChainMetadata as Mock).mockImplementation(() => chainMetadata[ChainId.BSC_TESTNET]);
  });

  it('renders without crashing', () => {
    renderComponent(<PoolTable />);
  });
});
