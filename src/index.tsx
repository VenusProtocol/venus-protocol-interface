import React from 'react';
import ReactDOM from 'react-dom';
import AppV1 from 'containers/App';
import App from 'pages/App';
// import * as serviceWorker from 'serviceWorker';

import 'antd/dist/antd.css';
import 'assets/styles/index.scss';

ReactDOM.render(
  process.env.REACT_APP_RUN_V2 ? <App /> : <AppV1 />,
  document.getElementById('root'),
);

// serviceWorker.register();
