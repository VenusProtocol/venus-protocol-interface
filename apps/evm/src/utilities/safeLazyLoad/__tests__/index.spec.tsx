import { act, render, screen } from '@testing-library/react';
import { Suspense, createElement } from 'react';
import { safeLazyLoad } from '..';

describe('safeLazyLoad', () => {
  // Mock window.location.reload
  const mockReload = vi.fn();
  Object.defineProperty(window, 'location', {
    value: { reload: mockReload },
    writable: true,
  });

  beforeEach(() => {
    mockReload.mockClear();
  });

  it('successfully loads and renders a component', async () => {
    const TestComponent = () => <div>Test Component</div>;
    const lazyComponent = safeLazyLoad(() => Promise.resolve({ default: TestComponent }));

    render(<Suspense fallback={<div>Loading...</div>}>{createElement(lazyComponent)}</Suspense>);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(mockReload).not.toHaveBeenCalled();
  });

  it('reloads the page when component fails to load', async () => {
    const lazyComponent = safeLazyLoad(() => Promise.reject(new Error('Failed to load')));

    render(<Suspense fallback={<div>Loading...</div>}>{createElement(lazyComponent)}</Suspense>);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});
