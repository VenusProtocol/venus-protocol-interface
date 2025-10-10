import { join } from 'node:path';

import { IMAGES_DIR_PATH } from '../../constants';
import { version as LIB_VERSION } from '../../constants/version';

export const getImgCdnPath = ({ filePath }: { filePath: string }) =>
  join(LIB_VERSION, filePath.replace(IMAGES_DIR_PATH, ''));
