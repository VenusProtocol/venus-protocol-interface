import { renderHook } from '@testing-library/react';
import { useNavigate as useRRNavigate } from 'react-router';
import type { Mock } from 'vitest';

import { useFormatTo } from 'hooks/useFormatTo';

import { useNavigate } from '..';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as any;

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('hooks/useFormatTo');

describe('useNavigate', () => {
  it('calls formatted navigate with correct parameters', () => {
    const formattedTo = { pathname: '/formatted-path' };
    const mockFormatTo = vi.fn(() => formattedTo);
    (useFormatTo as Mock).mockImplementation(() => ({
      formatTo: mockFormatTo,
    }));

    const mockRRNavigate = vi.fn();
    (useRRNavigate as Mock).mockImplementation(() => mockRRNavigate);

    const to = '/path';
    const options = { replace: true };

    const { result } = renderHook(() => useNavigate());

    result.current.navigate(to, options);

    expect(mockFormatTo).toHaveBeenCalledWith({ to });
    expect(mockRRNavigate).toHaveBeenCalledWith(formattedTo, options);
  });
});
