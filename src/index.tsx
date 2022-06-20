import React from 'react';
import BigNumber from 'bignumber.js';
import ReactDOM from 'react-dom';
import App from 'pages/App';

import 'antd/dist/antd.css';
import 'assets/styles/index.scss';

// Initialize BigNumber format
BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSize: 3,
    groupSeparator: ',',
  },
});

ReactDOM.render(<App />, document.getElementById('root'));
