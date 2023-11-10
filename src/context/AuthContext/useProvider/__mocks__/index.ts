import { getDefaultProvider } from 'ethers';

const defaultProvider = getDefaultProvider();
const useProvider = () => defaultProvider;
export default useProvider;
