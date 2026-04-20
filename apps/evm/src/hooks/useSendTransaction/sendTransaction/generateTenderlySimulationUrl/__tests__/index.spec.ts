import fakeAccountAddress from '__mocks__/models/address';
import { txData } from '__mocks__/models/transactionData';
import { ChainId } from 'types';
import { generateTenderlySimulationUrl } from '..';

const invalidTxData = {
  ...txData,
  functionName: 'missingFunction',
} as unknown as typeof txData;

describe('generateTenderlySimulationUrl', () => {
  it('returns a Tenderly simulation URL for a transaction', () => {
    const tenderlySimulationUrl = generateTenderlySimulationUrl({
      txData,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect(tenderlySimulationUrl).toBeDefined();

    const url = new URL(tenderlySimulationUrl!);

    expect(url.origin + url.pathname).toBe(
      'https://dashboard.tenderly.co/venus-labs/debug/simulator/new',
    );

    expect(Object.fromEntries(url.searchParams.entries())).toEqual({
      blockIndex: '0',
      from: fakeAccountAddress,
      value: '0',
      contractAddress: txData.address,
      network: `${ChainId.BSC_TESTNET}`,
      rawFunctionInput:
        '0x239083f8000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000004617267310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046172673200000000000000000000000000000000000000000000000000000000',
    });
  });

  it('returns undefined when the function is missing from the ABI', () => {
    expect(
      generateTenderlySimulationUrl({
        txData: invalidTxData,
        chainId: ChainId.BSC_TESTNET,
        accountAddress: fakeAccountAddress,
      }),
    ).toBeUndefined();
  });
});
