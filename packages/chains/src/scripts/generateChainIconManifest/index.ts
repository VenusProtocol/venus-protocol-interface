#!/usr/bin/env tsx
import { generateManifest } from '../../utilities/generateManifest';

console.log('Generating chain icon manifest...');
generateManifest({
  inputPublicDirPath: 'img/chains',
  outputFileName: 'chainIconSrcs.ts',
});
console.log('Finished generating chain icon manifest');
