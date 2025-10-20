import { readFileSync } from 'node:fs';
import { compile } from 'handlebars';

import { writeFile } from '../../../utilities/writeFile';
import type { TokenFile } from '../types';

const barrelFileTemplateBuffer = readFileSync(`${__dirname}/template.hbs`);
const barrelFileTemplate = compile(barrelFileTemplateBuffer.toString());

export const writeBarrelFile = ({ tokenFiles }: { tokenFiles: TokenFile[] }) => {
  const content = barrelFileTemplate(tokenFiles);
  const outputPath = 'src/generated/vTokens/index.ts';

  writeFile({
    content,
    outputPath,
  });
};
