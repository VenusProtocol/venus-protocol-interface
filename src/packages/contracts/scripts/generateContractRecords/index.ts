#!/usr/bin/env tsx
import { contracts } from 'packages/contracts/config';

import { generateContracts } from './generateContracts';

console.log('Generating contracts...');

generateContracts({ contractConfigs: contracts })
  .then(() => console.log('Finished generating contracts'))
  .catch(console.error);
