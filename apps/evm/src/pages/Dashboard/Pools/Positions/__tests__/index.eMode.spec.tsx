import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';
import { Positions } from '..';

const fakePool: Pool = {
  ...poolData[0],
  userEModeGroup: poolData[0].eModeGroups[0],
};

describe('Positions - Feature flag enabled: E-mode', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'eMode',
    );
  });

  it('displays E-mode banner correctly when user has enabled an E-mode group', async () => {
    const { container } = renderComponent(<Positions pools={[fakePool]} />);

    await waitFor(() => expect(container.textContent).not.toEqual(''));
    expect(container.textContent).toMatchSnapshot();
  });
});
