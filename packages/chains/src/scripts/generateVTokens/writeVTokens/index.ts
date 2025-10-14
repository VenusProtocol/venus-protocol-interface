import { http, type Address, createPublicClient } from 'viem';

import { viemChainMapping } from '../../../chains/viemChainMapping';
import { NATIVE_TOKEN_ADDRESS } from '../../../constants';
import { tokens } from '../../../tokens/underlyingTokens';
import type { ChainId } from '../../../types';
import { vBep20Abi } from './vBep20Abi';

export const writeVTokens = async ({
  addresses,
  outputFileName,
  chainId,
}: {
  addresses: Record<string, Address>;
  outputFileName: string;
  chainId: ChainId;
}) => {
  const vTokenAddresses = Object.entries(addresses).reduce<Address[]>((acc, [key, address]) => {
    if (!key.startsWith('v') && !key.startsWith('VToken_')) {
      return acc;
    }

    return [...acc, address];
  }, []);

  // Fetch vTokens
  const publicClient = createPublicClient({
    chain: viemChainMapping[chainId],
    transport: http(),
  });

  const results = await publicClient.multicall({
    contracts: vTokenAddresses.flatMap(
      vTokenAddress =>
        [
          {
            address: vTokenAddress,
            abi: vBep20Abi,
            functionName: 'symbol',
          },
          {
            address: vTokenAddress,
            abi: vBep20Abi,
            functionName: 'underlying',
          },
        ] as const,
    ),
  });

  const vTokenRecords: {
    address: Address;
    symbol: string;
    underlyingTokenIndex: number;
  }[] = [];

  for (let i = 0; i <= results.length - 2; i += 2) {
    const symbol = results[i].result;
    const address = (results[i + 1].result || NATIVE_TOKEN_ADDRESS) as Address;

    const chainTokens = tokens[chainId];
    const underlyingTokenIndex = chainTokens.findIndex(
      token => token.address.toLowerCase() === address.toLowerCase(),
    );

    if (!symbol) {
      throw new Error(`Failed to fetch vToken symbol. Address: ${address}`);
    }

    if (!underlyingTokenIndex) {
      throw new Error(`Could not find underlying token for vToken ${symbol}. Address: ${address}`);
    }

    vTokenRecords.push({
      address,
      symbol,
      underlyingTokenIndex,
    });
  }

  console.log(vTokenRecords);

  const outputPath = `src/generated/vTokens/${outputFileName}`;
};
