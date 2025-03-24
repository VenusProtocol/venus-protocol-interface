import { getPublicClient, getWalletClient } from '@wagmi/core';
import type { BaseContract } from 'ethers';
import { ZYFI_SPONSORED_PAYMASTER_ENDPOINT } from 'libs/wallet';
import { ChainId } from 'types';
import type { Config as WagmiConfig } from 'wagmi';
import { sendTransaction } from '..';

vi.mock('config', async () => {
  const actual = await vi.importActual('config');

  return {
    default: {
      ...(actual.default as Record<string, unknown>),
      zyFiApiKey: 'mockZyFiApiKey',
    },
  };
});

vi.mock('@wagmi/core', async () => {
  const actual = await vi.importActual('@wagmi/core');

  return {
    ...actual,
    getPublicClient: vi.fn(() => ({
      getTransactionCount: vi.fn(async () => 5),
    })),
    getWalletClient: vi.fn(() => ({
      chain: { id: ChainId.BSC_TESTNET },
      extend: vi.fn(() => ({
        prepareTransactionRequest: vi.fn(async () => 'mockPreparedTxRequest'),
        signTransaction: vi.fn(async () => 'mockSignedTransaction'),
        sendRawTransaction: vi.fn(async () => 'mockGaslessHash'),
      })),
    })),
  };
});

const GAS_ESTIMATION_FAILED_ERROR = 'Gas estimation failed';

// Mock contract
const mockContract = {
  address: '0xmockContractAddress',
  interface: {
    encodeFunctionData: vi.fn(() => '0xmockEncodedFunctionData'),
  },
  signer: {
    getChainId: vi.fn(async () => ChainId.BSC_TESTNET),
    getAddress: vi.fn(async () => '0xmockAddress'),
  },
  functions: {
    fakeMethod: vi.fn(async () => ({ hash: 'mockTransactionHash' })),
  },
} as unknown as BaseContract;

const mockWagmiConfig = {} as WagmiConfig;

describe('sendTransaction', () => {
  // Mocks setup
  beforeEach(() => {
    // Mock fetch global
    const mockFetchResponse = {
      ok: true,
      json: vi.fn(async () => ({
        txData: {
          chainId: ChainId.BSC_TESTNET,
          from: '0xmockAddress',
          to: '0xmockContractAddress',
          data: '0xmockTxData',
          value: 0,
          customData: {
            paymasterParams: {
              paymaster: '0xmockPaymasterAddress',
              paymasterInput: '0xmockPaymasterInput',
            },
            gasPerPubdata: 1500000,
          },
          maxFeePerGas: 200000000,
          gasLimit: 1000000,
        },
      })),
    };

    vi.spyOn(global, 'fetch').mockResolvedValue(mockFetchResponse as unknown as Response);
  });

  it('sends regular transaction when gasless is false', async () => {
    const txData = {
      contract: mockContract,
      methodName: 'fakeMethod',
      args: ['arg1', 'arg2'],
    };

    const result = await sendTransaction({
      txData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
    });

    expect(mockContract.signer.getChainId).toHaveBeenCalled();
    expect(mockContract.signer.getAddress).toHaveBeenCalled();
    expect(getPublicClient).toHaveBeenCalledWith(mockWagmiConfig, {
      chainId: ChainId.BSC_TESTNET,
    });
    expect(mockContract.functions.fakeMethod).toHaveBeenCalledWith('arg1', 'arg2');
    expect(result).toEqual({ transactionHash: 'mockTransactionHash' });
  });

  it('sends regular transaction with overrides when gasless is false', async () => {
    const txData = {
      contract: mockContract,
      methodName: 'fakeMethod',
      args: ['arg1', 'arg2'],
      overrides: { value: '100' },
    };

    const result = await sendTransaction({
      txData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
    });

    expect(mockContract.functions.fakeMethod).toHaveBeenCalledWith('arg1', 'arg2', {
      value: '100',
    });
    expect(result).toEqual({ transactionHash: 'mockTransactionHash' });
  });

  it('sends gasless transaction when gasless is true', async () => {
    const txData = {
      contract: mockContract,
      methodName: 'fakeMethod',
      args: ['arg1', 'arg2'],
    };

    const result = await sendTransaction({
      txData,
      gasless: true,
      wagmiConfig: mockWagmiConfig,
    });

    // Wallet client should be fetched
    expect(getWalletClient).toHaveBeenCalledWith(mockWagmiConfig, {
      chainId: ChainId.BSC_TESTNET,
      account: '0xmockAddress',
    });

    // Fetch should be called with correct params
    expect(global.fetch).toHaveBeenCalledWith(ZYFI_SPONSORED_PAYMASTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'mockZyFiApiKey',
      },
      body: expect.any(String),
    });

    // Contract interface should encode function data
    expect(mockContract.interface.encodeFunctionData).toHaveBeenCalledWith('fakeMethod', [
      'arg1',
      'arg2',
    ]);

    // Transaction transactionHash should be returned
    expect(result).toEqual({ transactionHash: 'mockGaslessHash' });
  });

  it('sends gasless transaction with overrides when gasless is true', async () => {
    const txData = {
      contract: mockContract,
      methodName: 'fakeMethod',
      args: ['arg1', 'arg2'],
      overrides: { value: '100' },
    };

    await sendTransaction({
      txData,
      gasless: true,
      wagmiConfig: mockWagmiConfig,
    });

    // Verify that the payload sent to the endpoint includes the overrides
    const fetchCall = (global.fetch as unknown as jest.SpyInstance).mock.calls[0];
    const body = JSON.parse(fetchCall[1].body);

    expect(body.txData).toMatchObject({
      to: mockContract.address,
      from: '0xmockAddress',
      data: '0xmockEncodedFunctionData',
      value: '100',
    });
  });

  it('throws an error when account address is undefined', async () => {
    const mockContractWithUndefinedAddress = {
      ...mockContract,
      signer: {
        ...mockContract.signer,
        getAddress: vi.fn(async () => undefined),
      },
    } as unknown as BaseContract;

    const txData = {
      contract: mockContractWithUndefinedAddress,
      methodName: 'fakeMethod',
      args: ['arg1', 'arg2'],
    };

    await expect(
      sendTransaction({
        txData,
        gasless: true,
        wagmiConfig: mockWagmiConfig,
      }),
    ).rejects.toThrow(
      expect.objectContaining({
        code: 'somethingWentWrong',
      }),
    );
  });

  it('throws an error when chain ID is undefined', async () => {
    const mockContractWithUndefinedChainId = {
      ...mockContract,
      signer: {
        ...mockContract.signer,
        getChainId: vi.fn(async () => undefined),
      },
    } as unknown as BaseContract;

    const txData = {
      contract: mockContractWithUndefinedChainId,
      methodName: 'fakeMethod',
      args: ['arg1', 'arg2'],
    };

    await expect(
      sendTransaction({
        txData,
        gasless: true,
        wagmiConfig: mockWagmiConfig,
      }),
    ).rejects.toThrow(
      expect.objectContaining({
        code: 'somethingWentWrong',
      }),
    );
  });

  it('throws gas estimation failed error for gasless transactions', async () => {
    const mockErrorResponse = {
      ok: false,
      json: vi.fn(async () => ({ error: GAS_ESTIMATION_FAILED_ERROR })),
    };

    vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockErrorResponse as unknown as Response);

    const txData = {
      contract: mockContract,
      methodName: 'fakeMethod',
      args: ['arg1', 'arg2'],
    };

    await expect(
      sendTransaction({
        txData,
        gasless: true,
        wagmiConfig: mockWagmiConfig,
      }),
    ).rejects.toThrow(
      expect.objectContaining({
        code: 'gasEstimationFailed',
      }),
    );
  });

  it('throws gaslessTransactionNotAvailable error for failed paymaster response', async () => {
    const mockErrorResponse = {
      ok: false,
      json: vi.fn(async () => ({ error: 'Some other error' })),
    };

    vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockErrorResponse as unknown as Response);

    const txData = {
      contract: mockContract,
      methodName: 'fakeMethod',
      args: ['arg1', 'arg2'],
    };

    await expect(
      sendTransaction({
        txData,
        gasless: true,
        wagmiConfig: mockWagmiConfig,
      }),
    ).rejects.toThrow(
      expect.objectContaining({
        code: 'gaslessTransactionNotAvailable',
      }),
    );
  });
});
