#!/usr/bin/env tsx
import { generateManifest } from '../../utilities/generateManifest';

console.log('Generating token icon manifest...');
generateManifest({
  inputPublicDirPath: 'img/tokens',
  outputFileName: 'tokenIconSrcs.ts',
});
console.log('Finished generating token icon manifest');
