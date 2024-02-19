import { mkdirSync, writeFileSync } from 'node:fs';

export interface WriteFileInput {
  outputPath: string;
  content: string;
}

export const AUTOMATICALLY_GENERATED_FILE_WARNING_MESSAGE =
  '/* Automatically generated file, do not update manually */';

export const writeFile = ({ outputPath, content }: WriteFileInput) => {
  const fileExtensionElements = outputPath.split('.');
  const fileExtension = fileExtensionElements[fileExtensionElements.length - 1];

  let formattedContent = content;

  // Prepend content with warning message
  if (fileExtension !== 'json') {
    formattedContent = `${AUTOMATICALLY_GENERATED_FILE_WARNING_MESSAGE}
    ${content}
    `;
  }

  // Create directory if it doesn't exist
  const directoryPathElements = outputPath.split('/');
  directoryPathElements.pop();
  const directoryPath = directoryPathElements.join('/');
  mkdirSync(directoryPath, { recursive: true });

  // Write file
  writeFileSync(outputPath, formattedContent, 'utf8');
};
