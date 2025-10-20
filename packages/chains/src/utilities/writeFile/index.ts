import { mkdirSync, writeFileSync } from 'node:fs';

// TODO: add tests

export const writeFile = ({ content, outputPath }: { content: string; outputPath: string }) => {
  // Create directory if it doesn't exist
  const directoryPathElements = outputPath.split('/');
  directoryPathElements.pop();
  const directoryPath = directoryPathElements.join('/');
  mkdirSync(directoryPath, { recursive: true });

  // Write file
  writeFileSync(outputPath, content);
};
