import { getPublicClient, getWalletClient } from '@wagmi/core';
import fakeAccountAddress from '__mocks__/models/address';
import type { BaseContract } from 'ethers';
import { ChainId, type LooseEthersContractTxData } from 'types';
import type { Mock } from 'vitest';
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

const mockWriteContract = vi.fn(() => 'mockTransactionHash');

const mockWalletClient = {
  chain: { id: ChainId.BSC_TESTNET },
  extend: vi.fn(() => ({
    prepareTransactionRequest: vi.fn(async () => 'mockPreparedTxRequest'),
    signTransaction: vi.fn(async () => 'mockSignedTransaction'),
    sendRawTransaction: vi.fn(async () => 'mockGaslessHash'),
    writeContract: mockWriteContract,
  })),
};

const mockPublicClient = {
  getTransactionCount: vi.fn(async () => 5),
  estimateGas: vi.fn(async () => 100000n),
};

vi.mock('@wagmi/core', async () => {
  const actual = await vi.importActual('@wagmi/core');

  return {
    ...actual,
    getPublicClient: vi.fn(() => mockPublicClient),
    getWalletClient: vi.fn(() => mockWalletClient),
  };
});

const GAS_ESTIMATION_FAILED_ERROR = 'Gas estimation failed';

// Mock contract
const mockContract = {
  address: '0xmockContractAddress',
  interface: {
    encodeFunctionData: vi.fn(() => '0xmockEncodedFunctionData'),
  },
  functions: {
    fakeMethod: vi.fn(async () => ({ hash: 'mockTransactionHash' })),
  },
} as unknown as BaseContract;

const mockWagmiConfig = {} as WagmiConfig;

const ethersTxData: LooseEthersContractTxData = {
  contract: mockContract,
  methodName: 'fakeMethod',
  args: ['arg1', 'arg2'],
};

const abi = [
  {
    constant: false,
    inputs: [
      { internalType: 'string', name: 'fakeArg1', type: 'string' },
      { internalType: 'string', name: 'fakeArg2', type: 'string' },
    ],
    name: 'fakeFunction',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

const txData = {
  abi,
  address: '0xmockAddress',
  functionName: 'fakeFunction',
  args: ['arg1', 'arg2'],
} as const;

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
    const result = await sendTransaction({
      txData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect(getPublicClient).toHaveBeenCalledWith(mockWagmiConfig, {
      chainId: ChainId.BSC_TESTNET,
    });
    expect(getWalletClient).toHaveBeenCalledWith(mockWagmiConfig, {
      chainId: ChainId.BSC_TESTNET,
      account: fakeAccountAddress,
    });

    expect(mockPublicClient.estimateGas.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "account": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          "data": "0x239083f8000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000004617267310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046172673200000000000000000000000000000000000000000000000000000000",
          "to": "0xmockAddress",
        },
      ]
    `);

    expect(mockWriteContract.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "abi": [
            {
              "constant": false,
              "inputs": [
                {
                  "internalType": "string",
                  "name": "fakeArg1",
                  "type": "string",
                },
                {
                  "internalType": "string",
                  "name": "fakeArg2",
                  "type": "string",
                },
              ],
              "name": "fakeFunction",
              "outputs": [
                {
                  "name": "",
                  "type": "bool",
                },
              ],
              "payable": false,
              "stateMutability": "payable",
              "type": "function",
            },
          ],
          "address": "0xmockAddress",
          "args": [
            "arg1",
            "arg2",
          ],
          "functionName": "fakeFunction",
          "gas": 135000n,
        },
      ]
    `);
    expect(result).toEqual({ transactionHash: 'mockTransactionHash' });
  });

  it('sends regular transaction with overrides when gasless is false', async () => {
    const customTxData = {
      abi,
      address: '0xmockAddress',
      functionName: 'fakeFunction',
      args: ['arg1', 'arg2'],
      value: 100n,
    } as const;

    const result = await sendTransaction({
      txData: customTxData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect(mockWriteContract.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "abi": [
            {
              "constant": false,
              "inputs": [
                {
                  "internalType": "string",
                  "name": "fakeArg1",
                  "type": "string",
                },
                {
                  "internalType": "string",
                  "name": "fakeArg2",
                  "type": "string",
                },
              ],
              "name": "fakeFunction",
              "outputs": [
                {
                  "name": "",
                  "type": "bool",
                },
              ],
              "payable": false,
              "stateMutability": "payable",
              "type": "function",
            },
          ],
          "address": "0xmockAddress",
          "args": [
            "arg1",
            "arg2",
          ],
          "functionName": "fakeFunction",
          "gas": 135000n,
          "value": 100n,
        },
      ]
    `);
    expect(result).toEqual({ transactionHash: 'mockTransactionHash' });
  });

  it('sends gasless transaction when gasless is true', async () => {
    const result = await sendTransaction({
      txData,
      gasless: true,
      wagmiConfig: mockWagmiConfig,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect((global.fetch as Mock).mock.calls[0]).toMatchSnapshot();
    expect(result).toEqual({ transactionHash: 'mockGaslessHash' });
  });

  it('sends gasless transaction with overrides when gasless is true', async () => {
    const customTxData = {
      ...ethersTxData,
      overrides: { value: '100' },
    };

    const result = await sendTransaction({
      txData: customTxData,
      gasless: true,
      wagmiConfig: mockWagmiConfig,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect((global.fetch as Mock).mock.calls[0]).toMatchSnapshot();
    expect(result).toEqual({ transactionHash: 'mockGaslessHash' });
  });

  it('sends regular ethers.js transaction when gasless is false', async () => {
    const result = await sendTransaction({
      txData: ethersTxData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect((getPublicClient as Mock).mock.calls[0]).toMatchInlineSnapshot(`
      [
        {},
        {
          "chainId": 97,
        },
      ]
    `);
    expect((getWalletClient as Mock).mock.calls[0]).toMatchInlineSnapshot(`
      [
        {},
        {
          "account": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          "chainId": 97,
        },
      ]
    `);

    expect((mockContract.functions.fakeMethod as Mock).mock.calls[0]).toMatchInlineSnapshot(`
      [
        "arg1",
        "arg2",
        {
          "gasLimit": 135000n,
        },
      ]
    `);
    expect(result).toEqual({ transactionHash: 'mockTransactionHash' });
  });

  it('sends regular ethers.js transaction with overrides when gasless is false', async () => {
    const txData = {
      ...ethersTxData,
      overrides: { value: '100' },
    };

    const result = await sendTransaction({
      txData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect((mockContract.functions.fakeMethod as Mock).mock.calls[0]).toMatchInlineSnapshot(`
      [
        "arg1",
        "arg2",
        {
          "gasLimit": 135000n,
          "value": "100",
        },
      ]
    `);
    expect(result).toEqual({ transactionHash: 'mockTransactionHash' });
  });

  it('sends gasless ethers.js transaction when gasless is true', async () => {
    const result = await sendTransaction({
      txData: ethersTxData,
      gasless: true,
      wagmiConfig: mockWagmiConfig,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect((global.fetch as Mock).mock.calls[0]).toMatchSnapshot();
    expect(result).toEqual({ transactionHash: 'mockGaslessHash' });
  });

  it('sends gasless ethers.js transaction with overrides when gasless is true', async () => {
    const customTxData = {
      ...ethersTxData,
      overrides: { value: '100' },
    };

    const result = await sendTransaction({
      txData: customTxData,
      gasless: true,
      wagmiConfig: mockWagmiConfig,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect((global.fetch as Mock).mock.calls[0]).toMatchSnapshot();
    expect(result).toEqual({ transactionHash: 'mockGaslessHash' });
  });

  it('throws gas estimation failed error for gasless transactions', async () => {
    const mockErrorResponse = {
      ok: false,
      json: vi.fn(async () => ({ error: GAS_ESTIMATION_FAILED_ERROR })),
    };

    vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockErrorResponse as unknown as Response);

    await expect(
      sendTransaction({
        txData: ethersTxData,
        gasless: true,
        wagmiConfig: mockWagmiConfig,
        chainId: ChainId.BSC_TESTNET,
        accountAddress: fakeAccountAddress,
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

    await expect(
      sendTransaction({
        txData: ethersTxData,
        gasless: true,
        wagmiConfig: mockWagmiConfig,
        chainId: ChainId.BSC_TESTNET,
        accountAddress: fakeAccountAddress,
      }),
    ).rejects.toThrow(
      expect.objectContaining({
        code: 'gaslessTransactionNotAvailable',
      }),
    );
  });
});
