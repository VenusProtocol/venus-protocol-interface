import { waitFor } from '@testing-library/dom';
import { poolData } from '__mocks__/models/pools';
import { useGetTokenBalances } from 'clients/api';
import { getVTreasuryContractAddress, getVTreasuryV8ContractAddress } from 'libs/contracts';
import { renderComponent } from 'testUtils/render';
import { ChainId } from 'types';
import type Vi from 'vitest';
import { PoolStats } from '..';

vi.mock('libs/contracts');

const fakeTreasuryContractAddress = 'fake-treasury-address';
const fakeTreasuryV8ContractAddress = 'fake-treasury-v8-address';

describe('PoolStats', () => {
  it('renders without crashing', async () => {
    renderComponent(<PoolStats pools={[]} stats={[]} />);
  });

  it('renders stats correctly', async () => {
    const { baseElement } = renderComponent(
      <PoolStats
        pools={poolData}
        stats={['supply', 'borrow', 'liquidity', 'treasury', 'assetCount']}
      />,
    );

    // Wait for all values to have loaded
    await waitFor(() => expect(baseElement.textContent!.includes('-')).toBeFalsy());

    expect(baseElement.textContent).toMatchSnapshot();
  });

  it.each([
    {
      chainId: ChainId.BSC_TESTNET,
      expectedTreasuryContractAddress: fakeTreasuryContractAddress,
    },
    {
      chainId: ChainId.BSC_MAINNET,
      expectedTreasuryContractAddress: fakeTreasuryContractAddress,
    },
    {
      chainId: ChainId.ETHEREUM,
      expectedTreasuryContractAddress: fakeTreasuryV8ContractAddress,
    },
    // We don't need to test for other chains as the rule is the logic is the same for all non-BSC chains
  ])(
    'use the correct treasury contract address based on the current chain: %s',
    async ({ chainId, expectedTreasuryContractAddress }) => {
      (getVTreasuryContractAddress as Vi.Mock).mockImplementation(
        () => fakeTreasuryContractAddress,
      );
      (getVTreasuryV8ContractAddress as Vi.Mock).mockImplementation(
        () => fakeTreasuryV8ContractAddress,
      );

      renderComponent(
        <PoolStats
          pools={poolData}
          stats={['supply', 'borrow', 'liquidity', 'treasury', 'assetCount']}
        />,
        {
          chainId,
        },
      );

      await waitFor(() =>
        expect(useGetTokenBalances).toHaveBeenCalledWith(
          {
            tokens: expect.anything(),
            accountAddress: expectedTreasuryContractAddress,
          },
          {
            enabled: true,
          },
        ),
      );
    },
  );

  it('only displays the requested stats', async () => {
    const { baseElement } = renderComponent(
      <PoolStats pools={poolData} stats={['assetCount', 'supply', 'treasury']} />,
    );

    // Wait for all values to have loaded
    await waitFor(() => expect(baseElement.textContent!.includes('-')).toBeFalsy());

    expect(baseElement.textContent).toMatchSnapshot();
  });
});
