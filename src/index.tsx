import App from 'App';
import React from 'react';
import { createRoot } from 'react-dom/client';

import 'assets/styles/index.scss';

import initializeLibraries from './initializeLibraries';

initializeLibraries();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
