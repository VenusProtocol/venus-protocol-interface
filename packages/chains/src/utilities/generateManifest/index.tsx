import fs, { mkdirSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { compile } from 'handlebars';

interface TokenIcon {
  name: string;
  href: string;
}

// Get CDN URL from env variables
const IMG_CDN_URL = process.env.IMG_CDN_URL;

const tokenIconUrlsTemplateBuffer = readFileSync(`${__dirname}/template.hbs`);
const tokenIconUrlsTemplate = compile(tokenIconUrlsTemplateBuffer.toString());

export const generateManifest = ({
  outputFileName,
  inputPublicDirPath,
}: {
  outputFileName: string;
  inputPublicDirPath: string;
}) => {
  const inputDirPath = `public/${inputPublicDirPath}`;
  const files = fs.readdirSync(inputDirPath);
  const manifest: TokenIcon[] = [];

  files.forEach(file => {
    const name = path.basename(file, path.extname(file));

    const tokenIcon: TokenIcon = {
      name,
      href:
        // Return CDN link to image if we're building the package for production, otherwise return
        // its local file location so apps can bundle it inside their build themselves
        IMG_CDN_URL
          ? `'${IMG_CDN_URL}/${inputPublicDirPath}/${file}'`
          : `new URL('../${inputDirPath}/${file}', import.meta.url).href`,
    };

    manifest.push(tokenIcon);
  });

  const content = tokenIconUrlsTemplate(manifest);

  const outputPath = `src/generated/${outputFileName}`;

  // Create directory if it doesn't exist
  const directoryPathElements = outputPath.split('/');
  directoryPathElements.pop();
  const directoryPath = directoryPathElements.join('/');
  mkdirSync(directoryPath, { recursive: true });

  // Write file
  fs.writeFileSync(outputPath, content);
};
