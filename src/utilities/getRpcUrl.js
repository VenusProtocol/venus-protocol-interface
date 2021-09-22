import sample from 'lodash/sample';

const REACT_APP_NODE_1 = 'https://bsc-dataseed1.ninicoin.io';
const REACT_APP_NODE_2 = 'https://bsc-dataseed1.defibit.io';
const REACT_APP_NODE_3 = 'https://bsc-dataseed.binance.org';

const REACT_APP_TEST_NODE_1 = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const REACT_APP_TEST_NODE_2 = 'https://data-seed-prebsc-2-s1.binance.org:8545';
const REACT_APP_TEST_NODE_3 = 'https://data-seed-prebsc-1-s2.binance.org:8545';

// Array of available nodes to connect to
const nodes = {
  56: [REACT_APP_NODE_1, REACT_APP_NODE_2, REACT_APP_NODE_3],
  97: [REACT_APP_TEST_NODE_1, REACT_APP_TEST_NODE_2, REACT_APP_TEST_NODE_3]
};

const getNodeUrl = () => {
  return sample(nodes[process.env.REACT_APP_CHAIN_ID]);
};

export default getNodeUrl;
