import type { WindowProvider } from 'wagmi/window';

declare global {
  interface WindowEthereum extends WindowProvider {
    isInfinityWallet?: true;
    isOpera?: true;
    isBinance?: true;
  }

  interface Window {
    ethereum?: WindowEthereum;
    okxwallet?: WindowEthereum;
    BinanceChain?: {
      bnbSign?: (
        address: string,
        message: string,
      ) => Promise<{ publicKey: string; signature: string }>;
      switchNetwork?: (networkId: string) => Promise<string>;
    } & Ethereum;
  }
}

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module 'emotion-theming';
