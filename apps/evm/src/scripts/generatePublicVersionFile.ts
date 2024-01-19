#!/usr/bin/env tsx
import * as path from 'path';
import { searchForWorkspaceRoot } from 'vite';

import { version } from 'constants/version';
import writeFile from 'utilities/writeFile';

const generatePublicVersionFile = async () => {
  const content = JSON.stringify({
    version,
  });

  console.log(searchForWorkspaceRoot(__dirname));

  // Generate file
  const outputPath = path.join(searchForWorkspaceRoot(__dirname), './apps/evm/public/version.json');

  writeFile({
    outputPath,
    content,
  });

  return outputPath;
};

console.log('Generating public version file...');

generatePublicVersionFile()
  .then(outputPath => console.log(`Finished generating public version file at: ${outputPath}`))
  .catch(console.error);
