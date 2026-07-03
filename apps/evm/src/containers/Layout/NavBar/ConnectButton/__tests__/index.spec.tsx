import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { useIsUserPrime } from 'hooks/useIsUserPrime';
import { renderComponent } from 'testUtils/render';

import { ConnectButton } from '..';

vi.mock('hooks/useIsUserPrime');
vi.mock('wagmi', () => ({
  useDisconnect: () => ({
    disconnect: vi.fn(),
  }),
}));

describe('ConnectButton', () => {
  beforeEach(() => {
    (useIsUserPrime as Mock).mockReturnValue({
      isUserPrime: false,
      isLoading: false,
    });
  });

  it('uses the shared Prime holder helper', () => {
    renderComponent(<ConnectButton />, {
      accountAddress: fakeAccountAddress,
    });

    expect(useIsUserPrime).toHaveBeenCalledWith({
      accountAddress: fakeAccountAddress,
    });
  });

  it('renders the Prime logo when the helper says the user is Prime', () => {
    (useIsUserPrime as Mock).mockReturnValue({
      isUserPrime: true,
      isLoading: false,
    });

    renderComponent(<ConnectButton />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getByAltText('Venus Prime logo')).toBeInTheDocument();
  });

  it('renders nothing while the helper is loading', () => {
    (useIsUserPrime as Mock).mockReturnValue({
      isUserPrime: false,
      isLoading: true,
    });

    const { container } = renderComponent(<ConnectButton />, {
      accountAddress: fakeAccountAddress,
    });

    expect(container.firstChild).toBeNull();
  });
});
