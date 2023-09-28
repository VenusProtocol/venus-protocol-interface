/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { FunctionFragment, Result } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';

import type { OnEvent, TypedEvent, TypedEventFilter, TypedListener } from './common';

export interface MaximillionInterface extends utils.Interface {
  functions: {
    'repayBehalf(address)': FunctionFragment;
    'repayBehalfExplicit(address,address)': FunctionFragment;
    'vBnb()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: 'repayBehalf' | 'repayBehalfExplicit' | 'vBnb',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'repayBehalf', values: [string]): string;
  encodeFunctionData(functionFragment: 'repayBehalfExplicit', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'vBnb', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'repayBehalf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'repayBehalfExplicit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'vBnb', data: BytesLike): Result;

  events: {};
}

export interface Maximillion extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MaximillionInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    repayBehalf(
      borrower: string,
      overrides?: PayableOverrides & { from?: string },
    ): Promise<ContractTransaction>;

    repayBehalfExplicit(
      borrower: string,
      vBnb_: string,
      overrides?: PayableOverrides & { from?: string },
    ): Promise<ContractTransaction>;

    vBnb(overrides?: CallOverrides): Promise<[string]>;
  };

  repayBehalf(
    borrower: string,
    overrides?: PayableOverrides & { from?: string },
  ): Promise<ContractTransaction>;

  repayBehalfExplicit(
    borrower: string,
    vBnb_: string,
    overrides?: PayableOverrides & { from?: string },
  ): Promise<ContractTransaction>;

  vBnb(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    repayBehalf(borrower: string, overrides?: CallOverrides): Promise<void>;

    repayBehalfExplicit(borrower: string, vBnb_: string, overrides?: CallOverrides): Promise<void>;

    vBnb(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    repayBehalf(
      borrower: string,
      overrides?: PayableOverrides & { from?: string },
    ): Promise<BigNumber>;

    repayBehalfExplicit(
      borrower: string,
      vBnb_: string,
      overrides?: PayableOverrides & { from?: string },
    ): Promise<BigNumber>;

    vBnb(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    repayBehalf(
      borrower: string,
      overrides?: PayableOverrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    repayBehalfExplicit(
      borrower: string,
      vBnb_: string,
      overrides?: PayableOverrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    vBnb(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
