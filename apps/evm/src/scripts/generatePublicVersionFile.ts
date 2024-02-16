#!/usr/bin/env tsx
import { writeFileSync } from 'node:fs';
import * as path from 'path';
import { searchForWorkspaceRoot } from 'vite';

import { version } from 'constants/version';

const generatePublicVersionFile = async () => {
  const content = JSON.stringify({
    version,
  });

  // Generate file
  const outputPath = path.join(searchForWorkspaceRoot(__dirname), './apps/evm/public/version.json');
  writeFileSync(outputPath, content, 'utf8');

  return outputPath;
};

console.log('Generating public version file...');

generatePublicVersionFile()
  .then(outputPath => console.log(`Finished generating public version file at: ${outputPath}`))
  .catch(console.error);
