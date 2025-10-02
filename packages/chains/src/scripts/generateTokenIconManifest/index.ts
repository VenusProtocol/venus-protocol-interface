#!/usr/bin/env tsx
import { generateManifest } from '../../utilities/generateManifest';

generateManifest({
  inputPublicDirPath: 'img/tokens',
  outputFileName: 'tokenIconSrcs.ts',
});
