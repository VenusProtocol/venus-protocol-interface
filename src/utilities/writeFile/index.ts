import { promises } from 'node:fs';

import { AUTOMATICALLY_GENERATED_FILE_WARNING_MESSAGE } from 'constants/automaticallyGeneratedFileWarningMessage';

export interface WriteFileInput {
  outputPath: string;
  content: string;
}

export const writeFile = async ({ outputPath, content }: WriteFileInput) => {
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
  await promises.mkdir(directoryPath, { recursive: true });

  // Write file
  await promises.writeFile(outputPath, formattedContent, 'utf8');
};
