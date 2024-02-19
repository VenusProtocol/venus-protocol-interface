import { cwd } from '@venusprotocol/file-system';
import * as path from 'path';

export const GENERATED_DIRECTORY_PATH = path.join(cwd(), './src/generated');
