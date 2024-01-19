import config from 'config';

import * as mainnetGql from './mainnet';
import * as testnetGql from './testnet';

export * as mainnetGql from './mainnet';
export * as testnetGql from './testnet';

const gql = config.isOnTestnet ? testnetGql : mainnetGql;

export default gql;
