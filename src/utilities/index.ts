export { promisify } from 'utilities/promisify';
export { restService } from 'utilities/restService';

export const isAssetDisabled = (assetId: string) => assetId === 'luna' || assetId === 'ust';
