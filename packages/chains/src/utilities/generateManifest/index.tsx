import fs from 'node:fs';
import path from 'node:path';

import { IMG_DIR_BASE_URL } from '../../constants';

export const generateManifest = ({
  outputPath,
  inputDirPath,
}: {
  outputPath: string;
  inputDirPath: string;
}) => {
  const files = fs.readdirSync(inputDirPath);
  const manifest: Record<string, string> = {};

  files.forEach(file => {
    const symbol = path.basename(file, path.extname(file));
    manifest[symbol] = IMG_DIR_BASE_URL + file;
  });

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
};
