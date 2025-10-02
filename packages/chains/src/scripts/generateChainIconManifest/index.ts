#!/usr/bin/env tsx
import { generateManifest } from '../../utilities/generateManifest';

generateManifest({
  inputPublicDirPath: 'img/chains',
  outputFileName: 'chainIconSrcs.ts',
});
