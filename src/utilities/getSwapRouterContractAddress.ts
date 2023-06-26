import { SWAP_ROUTERS } from 'constants/contracts/swapRouters';
import { logError } from 'context/ErrorLogger';

const getSwapRouterContractAddress = (poolComptrollerAddress: string) => {
  const formattedPoolComptrollerAddress = poolComptrollerAddress.toLowerCase();

  if (!Object.keys(SWAP_ROUTERS).includes(formattedPoolComptrollerAddress)) {
    logError(
      `Incorrect pool comptroller address (${formattedPoolComptrollerAddress}) provided to retrieve swap router address`,
    );
  }

  return SWAP_ROUTERS[formattedPoolComptrollerAddress];
};

export default getSwapRouterContractAddress;
