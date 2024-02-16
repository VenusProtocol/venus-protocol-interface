#!/usr/bin/env tsx
import { compile } from 'handlebars';
import fetch from 'node-fetch';
import { readFileSync } from 'node:fs';
import * as path from 'path';

import { GENERATED_DIRECTORY_PATH } from '../constants';
import writeFile from '../writeFile';

const PANCAKE_SWAP_TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/pancakeswap/token-list/main/lists/pancakeswap-extended.json';

const TOKEN_LIST_TEMPLATE_FILE_PATH = `${__dirname}/tokenListTemplate.hbs`;
const tokenListTemplateBuffer = readFileSync(TOKEN_LIST_TEMPLATE_FILE_PATH);
const tokenListTemplate = compile(tokenListTemplateBuffer.toString());

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
