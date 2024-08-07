import type {
  BaseProvider,
  FallbackProvider,
  JsonRpcProvider,
  JsonRpcSigner,
} from '@ethersproject/providers';

export type Provider = JsonRpcProvider | FallbackProvider | BaseProvider;
export type Signer = JsonRpcSigner;
