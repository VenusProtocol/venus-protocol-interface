import * as path from 'path';

import cwd from 'utilities/cwd';

export const CONTRACTS_PACKAGE_PATH = './src/libs/contracts';

export interface GetAbsolutePathInput {
  relativePath: string;
}

export const getAbsolutePath = ({ relativePath }: GetAbsolutePathInput) =>
  path.join(cwd(), `${CONTRACTS_PACKAGE_PATH}/${relativePath}`);
