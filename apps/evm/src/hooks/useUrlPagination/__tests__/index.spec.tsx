import { waitFor } from '@testing-library/react';
import { useSearchParams } from 'react-router';
import type { Mock } from 'vitest';

import { renderHook } from 'testUtils/render';

import { PAGE_PARAM_KEY, useUrlPagination } from '..';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as any;

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('useUrlPagination', () => {
  it('defaults to page 1 if no page param is set', () => {
    const mockSearchParams = new URLSearchParams();
    const mockSetSearchParams = vi.fn();

    (useSearchParams as Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    const { result } = renderHook(() => useUrlPagination());

    expect(result.current.currentPage).toBe(0);
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function), { replace: true });
  });

  it('returns current page correctly when page param is set', () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set(PAGE_PARAM_KEY, '3');
    const mockSetSearchParams = vi.fn();

    (useSearchParams as Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    const { result } = renderHook(() => useUrlPagination());

    expect(result.current.currentPage).toBe(2);
  });

  it('sets the page index correctly', async () => {
    const mockSearchParams = new URLSearchParams({
      [PAGE_PARAM_KEY]: '9999',
    });
    const mockSetSearchParams = vi.fn();

    (useSearchParams as Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    const { result } = renderHook(() => useUrlPagination());

    result.current.setCurrentPage(2);

    await waitFor(() =>
      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function), { replace: true }),
    );

    const mockSetSearchParamsInput = mockSetSearchParams.mock.calls[0][0];
    expect(mockSetSearchParamsInput(mockSearchParams)).toEqual({
      [PAGE_PARAM_KEY]: '3',
    });
  });
});
