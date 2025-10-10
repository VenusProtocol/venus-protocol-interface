#!/usr/bin/env tsx
import { program } from 'commander';

import { writeManifest } from './writeManifest';

program.requiredOption('--dirPath <string>').requiredOption('--outputFileName <string>');

program.parse();

const options = program.opts();

console.log('Generating token icon manifest...');

writeManifest({
  dirPath: options.dirPath,
  outputFileName: options.outputFileName,
});

console.log('Finished generating token icon manifest');
