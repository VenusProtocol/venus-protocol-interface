#!/usr/bin/env tsx
import { getTemplate, writeFile } from '@venusprotocol/file-system';
import fetch from 'node-fetch';
import * as path from 'path';

import { GENERATED_DIRECTORY_PATH } from '../constants';

const PANCAKE_SWAP_TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/pancakeswap/token-list/main/lists/pancakeswap-extended.json';

const tokenListTemplate = getTemplate({
  filePath: `${__dirname}/tokenListTemplate.hbs`,
});

const generatePancakeSwapTokenList = async () => {
  // Fetch token list
  const data = await fetch(PANCAKE_SWAP_TOKEN_LIST_URL);
  const jsonData: any = await data.json();
  const content = tokenListTemplate(jsonData.tokens);

  // Generate file
  const outputPath = path.join(
    GENERATED_DIRECTORY_PATH,
    './tokens/pancakeSwapTokens/bscMainnet.ts',
  );

  writeFile({
    outputPath,
    content,
  });

  return outputPath;
};

console.log('Generating PancakeSwap token list...');

generatePancakeSwapTokenList()
  .then(outputFilePath =>
    console.log(`Finished generating PancakeSwap token list at: ${outputFilePath}`),
  )
  .catch(console.error);
