import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';
// import * as serviceWorker from 'serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import Web3ReactManager from './utilities/Web3ReactManager';
import { getLibrary } from './utilities/connectors';

import 'antd/dist/antd.css';
import 'assets/styles/index.scss';

ReactDOM.render(
  <BrowserRouter>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactManager>
        <App />
      </Web3ReactManager>
    </Web3ReactProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// serviceWorker.register();
