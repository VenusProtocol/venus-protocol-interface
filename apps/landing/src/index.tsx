import { createRoot } from 'react-dom/client';
import './assets/styles/index.css';

import App from './App';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app')!);
root.render(<App />);
