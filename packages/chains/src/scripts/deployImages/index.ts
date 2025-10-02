#!/usr/bin/env tsx
import { createReadStream, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { put } from '@vercel/blob';

import { IMAGES_DIR_PATH } from '../../constants';
import { getImgCdnPath } from '../../utilities/getImgCdnPath';

const deployImages = async () => {
  // List files
  const filePaths: string[] = [];

  const traverseDir = ({ dirPath }: { dirPath: string }) => {
    const paths = readdirSync(dirPath);

    paths.map(path => {
      const relativePath = join(dirPath, path);
      const stats = statSync(relativePath);

      if (stats.isDirectory()) {
        traverseDir({ dirPath: relativePath });
      } else {
        filePaths.push(relativePath);
      }
    });
  };

  traverseDir({ dirPath: IMAGES_DIR_PATH });

  // Upload files to Vercel
  await Promise.all(
    filePaths.map(filePath => {
      const cdnFilePath = getImgCdnPath({ filePath });
      const file = createReadStream(filePath);

      return put(cdnFilePath, file, {
        access: 'public',
        // The Vercel Blob token will be automatically retrieved from env variables
      });
    }),
  );

  // TODO: remove outdated CDN image directories based on version
};

console.log('Deploying images to CDN...');

deployImages()
  .then(() => console.log('Finished deploying images to CDN'))
  .catch(error => {
    console.error(error);

    // TODO: uncomment
    // process.exit(1);
  });
