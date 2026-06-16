// biome-ignore lint/style/useNodejsImportProtocol: Vite browser client must resolve the npm buffer polyfill instead of Node's builtin module
import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client';

import 'assets/styles/index.css';

import App from 'App';
import initializeLibraries from './initializeLibraries';

// Some wallet SDK dependencies still expect Buffer on the browser global.
globalThis.Buffer ??= Buffer;

initializeLibraries();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
