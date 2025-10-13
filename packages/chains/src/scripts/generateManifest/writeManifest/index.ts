#!/usr/bin/env tsx
import fs, { readFileSync, mkdirSync } from 'node:fs';
import * as path from 'node:path';
import { compile } from 'handlebars';

import { IMAGES_DIR_NAME, IMAGES_DIR_PATH } from '../../../constants';
import { getImgCdnPath } from '../../../utilities/getImgCdnPath';

interface TokenIcon {
  name: string;
  src: string;
  import?: string;
}

const imgCdnUrl = process.env.IMG_CDN_URL;

const tokenIconUrlsTemplateBuffer = readFileSync(`${__dirname}/template.hbs`);
const tokenIconUrlsTemplate = compile(tokenIconUrlsTemplateBuffer.toString());

export const writeManifest = ({
  outputFileName,
  dirPath,
}: {
  outputFileName: string;
  dirPath: string;
}) => {
  const inputDirPath = path.join(IMAGES_DIR_PATH, dirPath);
  const files = fs.readdirSync(inputDirPath);
  const tokenIcons: TokenIcon[] = [];

  files.forEach(file => {
    const name = path.basename(file, path.extname(file));
    const destFilePath = path.join(dirPath, file);

    const tokenIcon: TokenIcon = {
      name,
      src:
        // Return CDN link to image if we're building the package for production, otherwise return
        // its local file import so apps can bundle it inside their build themselves
        imgCdnUrl ? `'${path.join(imgCdnUrl, getImgCdnPath({ filePath: destFilePath }))}'` : name,
      import: imgCdnUrl ? undefined : path.join('..', IMAGES_DIR_NAME, destFilePath),
    };

    tokenIcons.push(tokenIcon);
  });

  const content = tokenIconUrlsTemplate(tokenIcons);

  const outputPath = `src/generated/${outputFileName}`;

  // Create directory if it doesn't exist
  const directoryPathElements = outputPath.split('/');
  directoryPathElements.pop();
  const directoryPath = directoryPathElements.join('/');
  mkdirSync(directoryPath, { recursive: true });

  // Write file
  fs.writeFileSync(outputPath, content);
};
