import config from 'config';

import * as mainnetGql from './generated/mainnet';
import * as testnetGql from './generated/testnet';

export * as mainnetGql from './generated/mainnet';
export * as testnetGql from './generated/testnet';

const gql = config.isOnTestnet ? testnetGql : mainnetGql;

export default gql;
