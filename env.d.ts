/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAIN_ID: '97' | '56';
  readonly VITE_FF_ISOLATED_POOLS: 'true' | 'false';
  readonly VITE_FF_INTEGRATED_SWAP: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
