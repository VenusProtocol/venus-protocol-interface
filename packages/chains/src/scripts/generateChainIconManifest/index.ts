#!/usr/bin/env tsx
import { generateManifest } from '../../utilities/generateManifest';

generateManifest({
  inputDirPath: 'public/img/chains',
  outputPath: 'src/generated/chainIconUrls.json',
});
