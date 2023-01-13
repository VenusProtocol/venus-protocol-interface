import BigNumber from 'bignumber.js';
import React from 'react';
import ReactDOM from 'react-dom';

import 'assets/styles/index.scss';
import App from 'pages/App';

// Initialize BigNumber format
BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSize: 3,
    groupSeparator: ',',
  },
});

// Add hash to URL on the fly if it doesn't contain any (e.g.:
// /governance?page=1 => /#/governance?page=1). This is done to redirect users
// to the correct route if they followed an old link from before we switched to
// hash routing
if (window.location.pathname !== '/') {
  const url = `${window.location.origin}#${window.location.pathname}${window.location.search}`;
  window.location.replace(url);
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
