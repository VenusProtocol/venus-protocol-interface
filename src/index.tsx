import App from 'App';
import React from 'react';
import ReactDOM from 'react-dom';

import 'assets/styles/index.scss';

import initializeLibraries from './initializeLibraries';

initializeLibraries();

ReactDOM.render(<App />, document.getElementById('root'));
