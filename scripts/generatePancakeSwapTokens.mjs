import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';

const PANCAKE_SWAP_TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/pancakeswap/token-list/main/lists/pancakeswap-extended.json';

const formatSymbol = symbol => {
  const lowerCasedSymbol = symbol.toLowerCase();
  return /\d/.test(lowerCasedSymbol) ? `'${lowerCasedSymbol}'` : lowerCasedSymbol;
};

const generatePancakeSwapTokens = async () => {
  const data = await fetch(PANCAKE_SWAP_TOKEN_LIST_URL);
  const pancakeSwapTokenList = await data.json();

  // Define TypeScript code as a string
  const output = `
    import { Token } from 'types';

    export const MAINNET_PANCAKE_SWAP_TOKENS = {
      ${pancakeSwapTokenList.tokens
        // Remove tokens sharing the same symbol to prevent duplicates. This logic
        // has the drawback of ignoring some tokens. A solution to that would be
        // to store tokens as an array instead of an object (see VEN-1374)
        .reduce(
          (acc, token) => (acc.some(item => item.symbol === token.symbol) ? acc : [...acc, token]),
          [],
        )
        .map(
          pancakeSwapToken => `
            ${formatSymbol(pancakeSwapToken.symbol)}: {
              symbol: '${pancakeSwapToken.symbol}',
              decimals: ${pancakeSwapToken.decimals},
              address: '${pancakeSwapToken.address}',
              asset: '${pancakeSwapToken.logoURI}',
            } as Token
          `,
        )}
    };
  `;

  // Generate file
  const outputFilePath = path.join(
    process.cwd(),
    './src/constants/tokens/swap/mainnetPancakeSwapTokens.ts',
  );
  fs.writeFileSync(outputFilePath, output, 'utf8');
  return outputFilePath;
};

console.log('Generating PancakeSwap token list...');

generatePancakeSwapTokens()
  .then(outputFilePath =>
    console.log(`Finished generating PancakeSwap token list at: ${outputFilePath}`),
  )
  .catch(console.error);
