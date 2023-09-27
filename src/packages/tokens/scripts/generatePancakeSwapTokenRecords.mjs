import fetch from 'node-fetch';
import { writeFileSync } from 'node:fs';
import * as path from 'path';

const PANCAKE_SWAP_TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/pancakeswap/token-list/main/lists/pancakeswap-extended.json';

const generatePancakeSwapTokenRecords = async () => {
  const data = await fetch(PANCAKE_SWAP_TOKEN_LIST_URL);
  const pancakeSwapTokenList = await data.json();

  // Define TypeScript code as a string
  const output = `
    import { Token } from 'types';

    export const tokens: Token[] = [
    ${pancakeSwapTokenList.tokens
      .map(
        pancakeSwapToken => `
          {
            symbol: '${pancakeSwapToken.symbol}',
            decimals: ${pancakeSwapToken.decimals},
            address: '${pancakeSwapToken.address}',
            asset: '${pancakeSwapToken.logoURI}',
          },`,
      )
      .join('')}
    ];
  `;

  // Generate file
  const outputFilePath = path.join(
    process.cwd(),
    './src/packages/tokens/tokenInfos/pancakeSwapTokens/bscMainnet.ts',
  );
  writeFileSync(outputFilePath, output, 'utf8');
  return outputFilePath;
};

console.log('Generating PancakeSwap token list...');

generatePancakeSwapTokenRecords()
  .then(outputFilePath =>
    console.log(`Finished generating PancakeSwap token list at: ${outputFilePath}`),
  )
  .catch(console.error);
