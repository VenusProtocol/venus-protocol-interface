import * as path from 'path';

import cwd from '../cwd';

export const WEB3_PACKAGE_PATH = './packages/web3';

export interface GetAbsolutePathInput {
  relativePath: string;
}

export const getAbsolutePath = ({ relativePath }: GetAbsolutePathInput) =>
  path.join(cwd(), relativePath);
