import * as path from 'path';

export const CONTRACTS_PACKAGE_PATH = './src/packages/contractsNew';

export interface GetAbsolutePathInput {
  relativePath: string;
}

const getAbsolutePath = ({ relativePath }: GetAbsolutePathInput) =>
  path.join(process.cwd(), `${CONTRACTS_PACKAGE_PATH}/${relativePath}`);

export default getAbsolutePath;
