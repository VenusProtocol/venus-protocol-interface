import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import { xVSProxyOFTSrcAbi } from 'libs/contracts';
import { ChainId } from 'types';

import { getXvsBridgeDestinationLimits } from '..';

describe('getXvsBridgeDestinationLimits', () => {
  const openLimitMantissa = 20000000000000000000000n;

  it('reads the single transaction limit of every passed destination lane', async () => {
    const readContractMock = vi.fn().mockResolvedValue(openLimitMantissa);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsBridgeDestinationLimits({
      toChainIds: [ChainId.ETHEREUM, ChainId.OPBNB_MAINNET],
      bridgeContractAddress: fakeAddress,
      publicClient: fakePublicClient,
    });

    expect(readContractMock).toHaveBeenCalledTimes(2);

    // the contract is keyed by LayerZero chain ID, not by EVM chain ID
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: xVSProxyOFTSrcAbi,
      functionName: 'chainIdToMaxSingleTransactionLimit',
      args: [LAYER_ZERO_CHAIN_IDS[ChainId.ETHEREUM]],
    });
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: xVSProxyOFTSrcAbi,
      functionName: 'chainIdToMaxSingleTransactionLimit',
      args: [LAYER_ZERO_CHAIN_IDS[ChainId.OPBNB_MAINNET]],
    });

    expect(response).toMatchSnapshot();
  });

  it('reports a closed lane as a zero limit', async () => {
    const readContractMock = vi
      .fn()
      .mockImplementation(({ args }: { args: [number] }) =>
        Promise.resolve(
          args[0] === LAYER_ZERO_CHAIN_IDS[ChainId.ETHEREUM] ? openLimitMantissa : 0n,
        ),
      );

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const { maxSingleTransactionLimitMantissas } = await getXvsBridgeDestinationLimits({
      toChainIds: [ChainId.ETHEREUM, ChainId.OPBNB_MAINNET, ChainId.UNICHAIN_MAINNET],
      bridgeContractAddress: fakeAddress,
      publicClient: fakePublicClient,
    });

    expect(maxSingleTransactionLimitMantissas[ChainId.ETHEREUM]?.toFixed()).toBe(
      openLimitMantissa.toString(),
    );
    expect(maxSingleTransactionLimitMantissas[ChainId.OPBNB_MAINNET]?.toFixed()).toBe('0');
    expect(maxSingleTransactionLimitMantissas[ChainId.UNICHAIN_MAINNET]?.toFixed()).toBe('0');
  });

  it('performs no read when no destination is passed', async () => {
    const readContractMock = vi.fn();

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const { maxSingleTransactionLimitMantissas } = await getXvsBridgeDestinationLimits({
      toChainIds: [],
      bridgeContractAddress: fakeAddress,
      publicClient: fakePublicClient,
    });

    expect(readContractMock).not.toHaveBeenCalled();
    expect(maxSingleTransactionLimitMantissas).toEqual({});
  });
});
