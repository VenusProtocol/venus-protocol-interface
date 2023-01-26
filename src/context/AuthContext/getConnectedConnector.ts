import { Connector } from 'clients/web3';
import { LS_KEY_CONNECTED_CONNECTOR } from 'constants/localStorageKeys';

const getConnectedConnector = (): Connector | undefined => {
  const lsConnectedConnector = window.localStorage.getItem(LS_KEY_CONNECTED_CONNECTOR);

  return lsConnectedConnector &&
    Object.values(Connector).includes(lsConnectedConnector as Connector)
    ? (lsConnectedConnector as Connector)
    : undefined;
};

export default getConnectedConnector;
