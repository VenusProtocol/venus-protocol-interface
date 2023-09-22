import uniqueContractGetter from '../utilities/uniqueContractGetter';

import abi from '../generated/contractInfos/abis/venusLens';
import { VenusLens } from '../generated/contractInfos/types';

const getVenusLensContract = uniqueContractGetter<VenusLens>({
  name: 'venusLens',
  abi,
});

export default getVenusLensContract;
