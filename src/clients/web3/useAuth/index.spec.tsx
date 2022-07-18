import { NoBscProviderError } from '@binance-chain/bsc-connector';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { toast } from 'components';
import React, { useEffect } from 'react';

import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import useAuth from '.';
import setupNetwork from './setUpNetwork';

jest.mock('../../../components/Toast');
jest.mock('./setUpNetwork');
jest.mock('@web3-react/injected-connector');
jest.mock('@binance-chain/bsc-connector');
jest.mock('@web3-react/walletconnect-connector');

jest.mock('@web3-react/core', () => ({
  __esModule: true,
  Web3ReactProvider: ({ children }: { children: React.ReactChildren }) => <>{children}</>,
  UnsupportedChainIdError: Error, // UnsupportedChainIdError,
  useWeb3React: jest.fn(() => ({
    activate: jest.fn(async () => Promise.resolve()),
  })),
}));

describe('web3/useAuth/login', () => {
  beforeEach(() => {
    (setupNetwork as jest.Mock).mockImplementationOnce(async () => true);
  });

  test('login throws an error when connector is not found', async () => {
    renderComponent(() => {
      const { login } = useAuth();

      useEffect(() => {
        const callLogin = async () => {
          await login('unknownConnector' as any);
          expect(toast.error).toBeCalledWith({ message: en.wallets.errors.unsupportedWallet });
        };
        callLogin();
      });

      return <></>;
    });
  });

  test('calls activate with valid connector', async () => {
    const activate = jest.fn(async () => Promise.resolve());
    (useWeb3React as jest.Mock).mockImplementationOnce(() => ({
      activate,
    }));

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('MetaMask' as any);
    });

    await waitFor(() => expect(activate).toBeCalled());
  });

  test('throws authorize access error with UserRejectedRequestErrorInjected', async () => {
    const activate = jest.fn(async () => Promise.reject(new UserRejectedRequestErrorInjected()));
    (useWeb3React as jest.Mock).mockImplementationOnce(() => ({
      activate,
    }));

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('MetaMask' as any);
    });

    await waitFor(() => expect(activate).toBeCalled());
    expect(toast.error).toBeCalledWith({ message: en.wallets.errors.authorizeAccess });
  });

  test('throws authorize access error with UserRejectedRequestErrorWalletConnect', async () => {
    const activate = jest.fn(async () =>
      Promise.reject(new UserRejectedRequestErrorWalletConnect()),
    );
    (useWeb3React as jest.Mock).mockImplementationOnce(() => ({
      activate,
    }));

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('MetaMask' as any);
    });

    await waitFor(() => expect(activate).toBeCalled());
    expect(toast.error).toBeCalledWith({ message: en.wallets.errors.authorizeAccess });
  });

  test('throws no provider error with NoEthereumProviderError', async () => {
    const activate = jest.fn(async () => Promise.reject(new NoEthereumProviderError()));
    (useWeb3React as jest.Mock).mockImplementationOnce(() => ({
      activate,
    }));

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('MetaMask' as any);
    });

    await waitFor(() => expect(activate).toBeCalled());
    expect(toast.error).toBeCalledWith({ message: en.wallets.errors.noProvider });
  });

  test('throws no provider error with NoBscProviderError', async () => {
    const activate = jest.fn(async () => Promise.reject(new NoBscProviderError()));
    (useWeb3React as jest.Mock).mockImplementationOnce(() => ({
      activate,
    }));

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('MetaMask' as any);
    });

    await waitFor(() => expect(activate).toBeCalled());
    expect(toast.error).toBeCalledWith({ message: en.wallets.errors.noProvider });
  });

  test('throws no provider error with custom error', async () => {
    const customError = 'Custom error';
    const activate = jest.fn(async () => Promise.reject(new Error(customError)));
    (useWeb3React as jest.Mock).mockImplementationOnce(() => ({
      activate,
    }));

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('MetaMask' as any);
    });

    await waitFor(() => expect(activate).toBeCalled());
    expect(toast.error).toBeCalledWith({ message: customError });
  });
});
