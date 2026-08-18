import { render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { MemoryRouter, useLocation, useSearchParams } from 'react-router';

import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet/constants';
import { ChainId } from 'types';
import { Redirect } from '..';

const chainId = ChainId.BSC_TESTNET;
const unsupportedChainId = 999999999;
const targetRoute = '/existing-page';

// useFormatTo is mocked because it reads CHAIN_ID_SEARCH_PARAM from the libs/wallet barrel file,
// which the global mock of that module does not re-export
vi.mock('hooks/useFormatTo', () => ({
  useFormatTo: () => ({
    formatTo: ({ to }: { to: string }) => ({
      pathname: to,
      search: `?${CHAIN_ID_SEARCH_PARAM}=${chainId}`,
    }),
  }),
}));

const LocationDisplay = () => {
  const { pathname, search, key } = useLocation();

  return (
    <>
      <div data-testid="location">{`${pathname}${search}`}</div>

      <div data-testid="locationKey">{key}</div>
    </>
  );
};

// Mimics a component replacing the search params of the location it was rendered with, the
// way UrlChainIdFallback does
const SearchParamsSetter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get(CHAIN_ID_SEARCH_PARAM) === chainId.toString()) {
      return;
    }

    setSearchParams({ [CHAIN_ID_SEARCH_PARAM]: chainId.toString() }, { replace: true });
  }, [searchParams, setSearchParams]);

  return undefined;
};

const renderRedirect = ({
  initialPath,
  otherComponent,
}: { initialPath: string; otherComponent?: React.ReactNode }) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Redirect to={targetRoute} />

      {otherComponent}

      <LocationDisplay />
    </MemoryRouter>,
  );

describe('Redirect', () => {
  it('redirects to the formatted passed route', async () => {
    renderRedirect({ initialPath: '/removed-page' });

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        `${targetRoute}?${CHAIN_ID_SEARCH_PARAM}=${chainId}`,
      ),
    );
  });

  it('replaces the search params when they do not match the formatted passed route', async () => {
    renderRedirect({
      initialPath: `${targetRoute}?${CHAIN_ID_SEARCH_PARAM}=${unsupportedChainId}`,
    });

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        `${targetRoute}?${CHAIN_ID_SEARCH_PARAM}=${chainId}`,
      ),
    );
  });

  it('does not navigate when the current location already is the formatted passed route', async () => {
    const initialPath = `${targetRoute}?${CHAIN_ID_SEARCH_PARAM}=${chainId}`;
    renderRedirect({ initialPath });

    // MemoryRouter labels the location it was initialized with "default", so an unchanged key
    // means no navigation happened
    await waitFor(() => expect(screen.getByTestId('locationKey')).toHaveTextContent('default'));
    expect(screen.getByTestId('location')).toHaveTextContent(initialPath);
  });

  it('redirects again when another component replaces the search params of the location', async () => {
    renderRedirect({
      initialPath: `/removed-page?${CHAIN_ID_SEARCH_PARAM}=${unsupportedChainId}`,
      otherComponent: <SearchParamsSetter />,
    });

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        `${targetRoute}?${CHAIN_ID_SEARCH_PARAM}=${chainId}`,
      ),
    );
  });
});
