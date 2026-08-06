import { render, waitFor } from '@testing-library/react';
import config from 'config';
import { chains, defaultChain } from 'libs/wallet/chains';
import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet/constants';
import { useSearchParams } from 'react-router';
import type { Mock } from 'vitest';

import { UrlChainIdFallback } from '..';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as any;

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

const mockSetSearchParams = vi.fn();
const unsupportedChainId = 999999999;

const supportedChainId = chains.at(-1)?.id || defaultChain.id;

describe('UrlChainIdFallback', () => {
  beforeEach(() => {
    config.isSafeApp = false;
    mockSetSearchParams.mockClear();
  });

  afterEach(() => {
    config.isSafeApp = false;
  });

  it('replaces unsupported chain ID with the default chain ID', async () => {
    const mockSearchParams = new URLSearchParams({
      [CHAIN_ID_SEARCH_PARAM]: unsupportedChainId.toString(),
    });
    (useSearchParams as Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    render(<UrlChainIdFallback />);

    await waitFor(() =>
      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), {
        replace: true,
      }),
    );

    const nextSearchParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(nextSearchParams.get(CHAIN_ID_SEARCH_PARAM)).toBe(defaultChain.id.toString());
  });

  it('replaces malformed chain ID with the default chain ID', async () => {
    const mockSearchParams = new URLSearchParams({
      [CHAIN_ID_SEARCH_PARAM]: 'malformed-chain-id',
    });
    (useSearchParams as Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    render(<UrlChainIdFallback />);

    await waitFor(() => expect(mockSetSearchParams).toHaveBeenCalled());

    const nextSearchParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(nextSearchParams.get(CHAIN_ID_SEARCH_PARAM)).toBe(defaultChain.id.toString());
  });

  it('leaves supported chain ID unchanged', () => {
    const mockSearchParams = new URLSearchParams({
      [CHAIN_ID_SEARCH_PARAM]: supportedChainId.toString(),
    });
    (useSearchParams as Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    render(<UrlChainIdFallback />);

    expect(mockSetSearchParams).not.toHaveBeenCalled();
  });

  it('preserves unrelated query params', async () => {
    const mockSearchParams = new URLSearchParams({
      foo: 'bar',
      [CHAIN_ID_SEARCH_PARAM]: unsupportedChainId.toString(),
      baz: 'qux',
    });
    (useSearchParams as Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    render(<UrlChainIdFallback />);

    await waitFor(() => expect(mockSetSearchParams).toHaveBeenCalled());

    const nextSearchParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(nextSearchParams.get('foo')).toBe('bar');
    expect(nextSearchParams.get('baz')).toBe('qux');
    expect(nextSearchParams.get(CHAIN_ID_SEARCH_PARAM)).toBe(defaultChain.id.toString());
  });

  it('does not update the URL in Safe app mode', () => {
    config.isSafeApp = true;
    const mockSearchParams = new URLSearchParams({
      [CHAIN_ID_SEARCH_PARAM]: unsupportedChainId.toString(),
    });
    (useSearchParams as Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    render(<UrlChainIdFallback />);

    expect(mockSetSearchParams).not.toHaveBeenCalled();
  });
});
