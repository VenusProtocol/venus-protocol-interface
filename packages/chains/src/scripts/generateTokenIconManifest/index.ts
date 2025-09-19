#!/usr/bin/env tsx
import { generateManifest } from '../../utilities/generateManifest';

generateManifest({
  inputDirPath: 'public/img/tokens',
  outputPath: 'src/generated/tokenIconUrls.json',
});
