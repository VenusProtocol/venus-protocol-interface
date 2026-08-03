vi.unmock('zustand');

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { BODY_PORTAL_ID, PAGE_CONTAINER_ID } from 'constants/layout';
import { Layout } from '..';

vi.mock('../NavBar', () => ({
  NavBar: () => <nav>Navigation</nav>,
}));

vi.mock('../Header', () => ({
  Header: () => <header>Header</header>,
}));

vi.mock('../TestEnvWarning', () => ({
  TestEnvWarning: () => <div>Test warning</div>,
}));

vi.mock('../Footer', async () => {
  const React = await vi.importActual<typeof import('react')>('react');

  return {
    Footer: React.forwardRef<HTMLDivElement>((_, ref) => <footer ref={ref}>Footer</footer>),
  };
});

vi.mock('../ScrollToTop', async () => {
  const React = await vi.importActual<typeof import('react')>('react');

  return {
    default: React.forwardRef<HTMLButtonElement>((_, ref) => (
      <button ref={ref} type="button">
        Scroll top
      </button>
    )),
  };
});

describe('Layout', () => {
  it('renders the outlet, header, footer, and portal structure', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<main>Dashboard outlet</main>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Test warning')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Dashboard outlet')).toBeInTheDocument();
    expect(screen.getByText('Scroll top')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(document.getElementById(PAGE_CONTAINER_ID)).toBeInTheDocument();
    expect(document.getElementById(BODY_PORTAL_ID)).toBeInTheDocument();
  });
});
