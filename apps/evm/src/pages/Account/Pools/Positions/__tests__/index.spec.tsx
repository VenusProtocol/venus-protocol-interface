import { waitFor } from '@testing-library/react';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { Positions } from '..';

describe('Positions', () => {
  it('displays content correctly', async () => {
    const { container } = renderComponent(<Positions pools={[poolData[0]]} />);

    await waitFor(() => expect(container.textContent).not.toEqual(''));
    expect(container.textContent).toMatchSnapshot();
  });
});
