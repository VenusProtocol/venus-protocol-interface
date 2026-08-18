import { render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { MemoryRouter, useLocation, useSearchParams } from 'react-router';

import { Redirect } from '..';

const chainIdSearchParam = 'chainId';
const chainId = 97;
const targetRoute = '/existing-page';

vi.mock('hooks/useFormatTo', () => ({
  useFormatTo: () => ({
    formatTo: ({ to }: { to: string }) => ({
      pathname: to,
      search: `?${chainIdSearchParam}=${chainId}`,
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
    if (searchParams.get(chainIdSearchParam) === chainId.toString()) {
      return;
    }

    setSearchParams({ [chainIdSearchParam]: chainId.toString() }, { replace: true });
  }, [searchParams, setSearchParams]);

  return null;
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
        `${targetRoute}?${chainIdSearchParam}=${chainId}`,
      ),
    );
  });

  it('replaces the search params when they do not match the formatted passed route', async () => {
    renderRedirect({ initialPath: `${targetRoute}?${chainIdSearchParam}=999999999` });

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        `${targetRoute}?${chainIdSearchParam}=${chainId}`,
      ),
    );
  });

  it('does not navigate when the current location already is the formatted passed route', async () => {
    const initialPath = `${targetRoute}?${chainIdSearchParam}=${chainId}`;
    renderRedirect({ initialPath });

    // MemoryRouter labels the location it was initialized with "default", so an unchanged key
    // means no navigation happened
    await waitFor(() => expect(screen.getByTestId('locationKey')).toHaveTextContent('default'));
    expect(screen.getByTestId('location')).toHaveTextContent(initialPath);
  });

  it('redirects again when another component replaces the search params of the location', async () => {
    renderRedirect({
      initialPath: `/removed-page?${chainIdSearchParam}=999999999`,
      otherComponent: <SearchParamsSetter />,
    });

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        `${targetRoute}?${chainIdSearchParam}=${chainId}`,
      ),
    );
  });
});
