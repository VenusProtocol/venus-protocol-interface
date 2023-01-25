import { LS_KEY_CONNECTED_CONNECTOR } from 'constants/localStorageKeys';

import { Connector } from '../types';

const getConnectedConnector = (): Connector | undefined => {
  const lsConnectedConnector = window.localStorage.getItem(LS_KEY_CONNECTED_CONNECTOR);

  return lsConnectedConnector &&
    Object.values(Connector).includes(lsConnectedConnector as Connector)
    ? (lsConnectedConnector as Connector)
    : undefined;
};

export default getConnectedConnector;
