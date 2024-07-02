import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import { AssetInfo, type AssetInfoProps } from '..';

describe('y', () => {
  it('renders without crashing', async () => {
    renderComponent(<AssetInfo asset={poolData[0].assets[0]} action="supply" />);
  });

  it.each([
    { action: 'supply' },
    { action: 'withdraw' },
    { action: 'borrow' },
    { action: 'repay' },
  ] as { action: AssetInfoProps['action']; amountToken: number }[])(
    'renders correct values: %s',
    async ({ action }) => {
      const { container } = renderComponent(
        <AssetInfo asset={poolData[0].assets[0]} action={action} />,
      );

      expect(container.textContent).toMatchSnapshot();
    },
  );
});
