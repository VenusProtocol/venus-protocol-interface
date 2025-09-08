import { waitFor } from '@testing-library/react';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { PoolPositions } from '..';

describe('PoolPositions', () => {
  it('displays content correctly', async () => {
    const { container } = renderComponent(<PoolPositions pools={[poolData[0]]} />);

    await waitFor(() => expect(container.textContent).not.toEqual(''));
    expect(container.textContent).toMatchSnapshot();
  });
});
