import { BASE_BSC_SCAN_URL } from 'config';

const generateBscScanAddressUrl = (address: string) => `${BASE_BSC_SCAN_URL}/address/${address}`;

export default generateBscScanAddressUrl;
