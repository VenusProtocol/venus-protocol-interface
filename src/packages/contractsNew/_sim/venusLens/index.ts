import uniqueContractGetterGenerator from '../../utilities/uniqueContractGetterGeneratorGenerator';

import abi from '../contractInfos/abis/venusLens';
import { VenusLens } from '../contractInfos/types';

const useGetVenusLensContract = 

const getVenusLensContract = uniqueContractGetterGenerator<VenusLens>({
  name: 'venusLens',
  abi,
});

export default getVenusLensContract;
