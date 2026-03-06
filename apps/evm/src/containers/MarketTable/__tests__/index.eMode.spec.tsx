import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import { MarketTable } from '../index';
import type { ColumnKey } from '../types';

vi.mock('hooks/useCollateral');

const columns: ColumnKey[] = ['asset', 'supplyApy', 'borrowApy', 'collateral', 'userWalletBalance'];

describe('MarketTable - Feature flag enabled: E-mode', () => {
  it('renders correctly when user does not have any E-mode group enabled', () => {
    const { container } = renderComponent(
      <MarketTable
        assets={poolData[0].assets}
        poolName={poolData[0].name}
        poolComptrollerContractAddress={poolData[0].comptrollerAddress}
        columns={columns}
        marketType="supply"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders correctly when user has an E-mode group enabled', () => {
    const { container } = renderComponent(
      <MarketTable
        assets={poolData[0].assets}
        poolName={poolData[0].name}
        poolComptrollerContractAddress={poolData[0].comptrollerAddress}
        userEModeGroup={poolData[0].eModeGroups[0]}
        columns={columns}
        marketType="supply"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();
  });
});
