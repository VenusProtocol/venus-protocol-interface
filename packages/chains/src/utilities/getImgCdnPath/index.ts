import { join } from 'node:path';

import { version as LIB_VERSION } from '../../constants/version';

export const getImgCdnPath = ({ filePath }: { filePath: string }) => join(LIB_VERSION, filePath);
