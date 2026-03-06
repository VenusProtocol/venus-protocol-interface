import { poolData } from '__mocks__/models/pools';
import { busd } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';
import { EModeInfo } from '..';

describe('EModeInfo', () => {
  const fakePool = poolData[0];

  it('returns null when token has no E-mode settings', () => {
    const { container } = renderComponent(
      <EModeInfo token={busd} pool={fakePool} eModeGroups={fakePool.eModeGroups} />,
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders only E-mode section when token belongs only to non-isolated groups', () => {
    const token = fakePool.assets[2].vToken.underlyingToken;

    const { container } = renderComponent(
      <EModeInfo token={token} pool={fakePool} eModeGroups={fakePool.eModeGroups} />,
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders E-mode and Isolation mode sections when token belongs to both', () => {
    const token = fakePool.assets[1].vToken.underlyingToken;

    const { container } = renderComponent(
      <EModeInfo token={token} pool={fakePool} eModeGroups={fakePool.eModeGroups} />,
    );

    expect(container.textContent).toMatchSnapshot();
  });
});
