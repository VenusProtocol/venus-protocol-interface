import Handlebars, { compile } from 'handlebars';
import { readFileSync } from 'node:fs';

// Register Handlebars helpers
Handlebars.registerHelper(
  'lowercaseFirst',
  (text: string) => text.charAt(0).toLowerCase() + text.slice(1),
);

Handlebars.registerHelper('json', (context: object) => JSON.stringify(context));

export const getTemplate = ({ filePath }: { filePath: string }) => {
  const templateBuffer = readFileSync(filePath);
  return compile(templateBuffer.toString());
};
