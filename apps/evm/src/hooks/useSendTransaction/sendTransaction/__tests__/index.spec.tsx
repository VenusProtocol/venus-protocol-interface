import type { GetFusionQuotePayload, MeeClient } from '@biconomy/abstractjs';
import fakeAccountAddress from '__mocks__/models/address';
import { txData } from '__mocks__/models/transactionData';
import { ChainId } from 'types';
import type { PublicClient, WalletClient } from 'viem';
import type { Mock } from 'vitest';
import { sendTransaction } from '..';

const mockWriteContract = vi.fn(() => 'mockTransactionHash');

const mockWalletClient = {
  chain: { id: ChainId.BSC_TESTNET },
  writeContract: mockWriteContract,
  extend: vi.fn(() => ({
    prepareTransactionRequest: vi.fn(async () => 'mockPreparedTxRequest'),
    signTransaction: vi.fn(async () => 'mockSignedTransaction'),
    sendRawTransaction: vi.fn(async () => 'mockGaslessHash'),
  })),
} as unknown as WalletClient;

const mockPublicClient = {
  getTransactionCount: vi.fn(async () => 5),
  estimateGas: vi.fn(async () => 100000n),
} as unknown as PublicClient;

const mockMeeClient = {
  executeFusionQuote: vi.fn(async () => ({ hash: 'mockBiconomyHash' })),
} as unknown as MeeClient;

const mockFusionQuoteInput = {
  trigger: {
    chainId: ChainId.BSC_TESTNET,
    tokenAddress: '0xmockTokenAddress',
  },
  quote: {
    hash: '0xfakeHash',
    node: '0xfakeNode',
    commitment: '0xfakeCommitment',
    paymentInfo: {
      sender: '0xfakeSenderAddress',
      token: '0xfakeTokenAddress',
      nonce: '1',
      chainId: `${ChainId.BSC_TESTNET}`,
      tokenAmount: '1',
      tokenWeiAmount: '1',
      tokenValue: '1',
    },
    userOps: [],
  },
} as unknown as GetFusionQuotePayload;

const GAS_ESTIMATION_FAILED_ERROR = 'Gas estimation failed';

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
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
      walletClient: mockWalletClient,
      publicClient: mockPublicClient,
    });

    expect((mockPublicClient.estimateGas as Mock).mock.calls[0]).toMatchInlineSnapshot(`
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
      abi: txData.abi,
      address: '0xmockAddress',
      functionName: 'fakeFunction',
      args: ['arg1', 'arg2'],
      value: 100n,
    } as const;

    const result = await sendTransaction({
      txData: customTxData,
      gasless: false,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
      walletClient: mockWalletClient,
      publicClient: mockPublicClient,
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
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
      walletClient: mockWalletClient,
      publicClient: mockPublicClient,
    });

    expect((global.fetch as Mock).mock.calls[0]).toMatchSnapshot();
    expect(result).toEqual({ transactionHash: 'mockGaslessHash' });
  });

  it('sends gasless transaction with overrides when gasless is true', async () => {
    const customTxData = {
      ...txData,
      overrides: { value: '100' },
    };

    const result = await sendTransaction({
      txData: customTxData,
      gasless: true,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
      walletClient: mockWalletClient,
      publicClient: mockPublicClient,
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
        txData,
        gasless: true,
        chainId: ChainId.BSC_TESTNET,
        accountAddress: fakeAccountAddress,
        walletClient: mockWalletClient,
        publicClient: mockPublicClient,
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
        txData,
        gasless: true,
        chainId: ChainId.BSC_TESTNET,
        accountAddress: fakeAccountAddress,
        walletClient: mockWalletClient,
        publicClient: mockPublicClient,
      }),
    ).rejects.toThrow(
      expect.objectContaining({
        code: 'gaslessTransactionNotAvailable',
      }),
    );
  });

  it('sends biconomy transaction successfully', async () => {
    const result = await sendTransaction({
      txData: mockFusionQuoteInput,
      meeClient: mockMeeClient,
    });

    expect(mockMeeClient.executeFusionQuote).toHaveBeenCalledWith({
      fusionQuote: mockFusionQuoteInput,
    });
    expect(result).toMatchInlineSnapshot(`
      {
        "transactionHash": "mockBiconomyHash",
      }
    `);
  });

  it('handles biconomy transaction execution error', async () => {
    const error = new Error('Biconomy execution failed');
    (mockMeeClient.executeFusionQuote as Mock).mockRejectedValueOnce(error);

    await expect(
      sendTransaction({
        txData: mockFusionQuoteInput,
        meeClient: mockMeeClient,
      }),
    ).rejects.toThrow('Biconomy execution failed');
  });
});
