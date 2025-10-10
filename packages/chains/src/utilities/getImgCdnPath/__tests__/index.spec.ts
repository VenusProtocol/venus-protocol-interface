import { getImgCdnPath } from '..';
import { IMAGES_DIR_PATH } from '../../../constants';
import { version as LIB_VERSION } from '../../../constants/version';

vi.mock('../../../constants/version', () => ({
  version: '9.9.9',
}));

vi.mock('../../../constants', () => ({
  IMAGES_DIR_PATH: 'fake/img/dir/path',
}));

describe('getImgCdnPath', () => {
  it('returns the path of the image on the CDN', () => {
    expect(getImgCdnPath({ filePath: `${IMAGES_DIR_PATH}/fake/file/path` })).toBe(
      `${LIB_VERSION}/fake/file/path`,
    );
  });
});
