#!/usr/bin/env tsx

import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { compile } from 'handlebars';
import { getAbsolutePath } from 'libs/contracts/utilities/getAbsolutePath';
import writeFile from 'utilities/writeFile';
import { searchForWorkspaceRoot } from 'vite';
import { version } from '../../../../../package.json';

const randomizer = Math.floor(Math.random() * 1000);

const TEMPLATES_DIRECTORY = `${__dirname}/templates`;

const templateBuffer = readFileSync(`${TEMPLATES_DIRECTORY}/template.hbs`);
const template = compile(templateBuffer.toString());

const OUTPUT_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'generated',
});

export const generateVersionFile = async () => {
  // Generate version file with randomizer to bypass browser cache
  const localOutputPath = `${OUTPUT_DIRECTORY_PATH}/version.${randomizer}.json`;
  const publicOutputPath = path.join(
    searchForWorkspaceRoot(__dirname),
    './apps/evm/public/version.json',
  );

  const content = template({ version });

  console.log('Start generating local version file...');
  writeFile({
    outputPath: localOutputPath,
    content,
  });
  console.log('Finished generating local version file');

  console.log('Start generating public version file...');
  writeFile({
    outputPath: publicOutputPath,
    content,
  });
  console.log('Finished generating public version file');
};
