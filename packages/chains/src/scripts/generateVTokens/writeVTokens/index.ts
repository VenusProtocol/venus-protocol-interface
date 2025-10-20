import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { compile } from 'handlebars';
import type { Address } from 'viem';

import { NATIVE_TOKEN_ADDRESS } from '../../../constants';
import type { ChainId, Token } from '../../../types';
import { createPublicClient } from '../../../utilities/createPublicClient';
import { writeFile } from '../../../utilities/writeFile';
import { vBep20Abi } from './vBep20Abi';

const require = createRequire(import.meta.url);

require.extensions['.svg'] = () => '';
require.extensions['.png'] = () => '';

// Dynamically load tokens to make sure image fields aren't loaded as modules, which tsx does not
// support
const tokensPromise = import('../../../tokens/underlyingTokens').then(module => module.tokens);

const vTokensTemplateBuffer = readFileSync(`${__dirname}/template.hbs`);
const vTokensTemplate = compile(vTokensTemplateBuffer.toString());

export const writeVTokens = async ({
  vTokenAddresses,
  outputFileName,
  chainId,
}: {
  vTokenAddresses: Address[];
  outputFileName: string;
  chainId: ChainId;
}) => {
  // Fetch vTokens
  const publicClient = createPublicClient({ chainId });

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

  const vTokens: {
    address: Address;
    symbol: string;
    underlyingTokenIndex: number;
    chainId: ChainId;
    iconSrc?: string;
  }[] = [];

  const chainTokens = (await tokensPromise)[chainId] as Token[];

  for (let i = 0; i <= results.length - 2; i += 2) {
    const symbol = results[i].result;

    const underlyingAddress = (results[i + 1].result || NATIVE_TOKEN_ADDRESS) as Address;

    const underlyingTokenIndex = chainTokens.findIndex(
      token => token.address.toLowerCase() === underlyingAddress.toLowerCase(),
    );

    const vTokenAddress = vTokenAddresses[i / 2];

    if (!symbol) {
      throw new Error(
        `Failed to fetch vToken symbol. Chain ID: ${chainId} Address: ${vTokenAddress}`,
      );
    }

    if (underlyingTokenIndex < 0) {
      throw new Error(
        `Could not find underlying token for vToken ${symbol}. Chain ID: ${chainId} Address: ${vTokenAddress}`,
      );
    }

    vTokens.push({
      address: vTokenAddress,
      symbol,
      chainId,
      underlyingTokenIndex,
    });
  }
  const content = vTokensTemplate({
    vTokens,
    chainId,
    tokenFileName: outputFileName,
  });

  const outputPath = `src/generated/vTokens/${outputFileName}.ts`;

  writeFile({
    content,
    outputPath,
  });
};
