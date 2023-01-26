import { Connector } from 'clients/web3/types';

export type BaseWallet = {
  name: string;
  Logo: React.FC<React.SVGProps<SVGSVGElement>>;
};

export type Wallet = BaseWallet & {
  connector: Connector;
  mainnetOnly?: boolean;
};

// Integrated wallets represent wallets that are integrated through third-party
// apps but not directly from our dApp. These wallets are displayed on the UI as
// options that on click redirect to a web page explaining how to set them up
// through a third-party app (e.g.: MetaMask).
export type IntegratedWallet = BaseWallet & {
  linkUrl: string;
};
