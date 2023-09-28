/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { EventFragment, FunctionFragment, Result } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';

import type { OnEvent, TypedEvent, TypedEventFilter, TypedListener } from './common';

export interface JumpRateModelV2Interface extends utils.Interface {
  functions: {
    'accessControlManager()': FunctionFragment;
    'baseRatePerBlock()': FunctionFragment;
    'getBorrowRate(uint256,uint256,uint256,uint256)': FunctionFragment;
    'getSupplyRate(uint256,uint256,uint256,uint256,uint256)': FunctionFragment;
    'isInterestRateModel()': FunctionFragment;
    'jumpMultiplierPerBlock()': FunctionFragment;
    'kink()': FunctionFragment;
    'multiplierPerBlock()': FunctionFragment;
    'updateJumpRateModel(uint256,uint256,uint256,uint256)': FunctionFragment;
    'utilizationRate(uint256,uint256,uint256,uint256)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'accessControlManager'
      | 'baseRatePerBlock'
      | 'getBorrowRate'
      | 'getSupplyRate'
      | 'isInterestRateModel'
      | 'jumpMultiplierPerBlock'
      | 'kink'
      | 'multiplierPerBlock'
      | 'updateJumpRateModel'
      | 'utilizationRate',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'accessControlManager', values?: undefined): string;
  encodeFunctionData(functionFragment: 'baseRatePerBlock', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'getBorrowRate',
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'getSupplyRate',
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish],
  ): string;
  encodeFunctionData(functionFragment: 'isInterestRateModel', values?: undefined): string;
  encodeFunctionData(functionFragment: 'jumpMultiplierPerBlock', values?: undefined): string;
  encodeFunctionData(functionFragment: 'kink', values?: undefined): string;
  encodeFunctionData(functionFragment: 'multiplierPerBlock', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'updateJumpRateModel',
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'utilizationRate',
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish],
  ): string;

  decodeFunctionResult(functionFragment: 'accessControlManager', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'baseRatePerBlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getBorrowRate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getSupplyRate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isInterestRateModel', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'jumpMultiplierPerBlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'kink', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'multiplierPerBlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updateJumpRateModel', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'utilizationRate', data: BytesLike): Result;

  events: {
    'NewInterestParams(uint256,uint256,uint256,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'NewInterestParams'): EventFragment;
}

export interface NewInterestParamsEventObject {
  baseRatePerBlock: BigNumber;
  multiplierPerBlock: BigNumber;
  jumpMultiplierPerBlock: BigNumber;
  kink: BigNumber;
}
export type NewInterestParamsEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber],
  NewInterestParamsEventObject
>;

export type NewInterestParamsEventFilter = TypedEventFilter<NewInterestParamsEvent>;

export interface JumpRateModelV2 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: JumpRateModelV2Interface;

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
    accessControlManager(overrides?: CallOverrides): Promise<[string]>;

    baseRatePerBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    getBorrowRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    getSupplyRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      reserveFactorMantissa: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    isInterestRateModel(overrides?: CallOverrides): Promise<[boolean]>;

    jumpMultiplierPerBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    kink(overrides?: CallOverrides): Promise<[BigNumber]>;

    multiplierPerBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    updateJumpRateModel(
      baseRatePerYear: BigNumberish,
      multiplierPerYear: BigNumberish,
      jumpMultiplierPerYear: BigNumberish,
      kink_: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    utilizationRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;
  };

  accessControlManager(overrides?: CallOverrides): Promise<string>;

  baseRatePerBlock(overrides?: CallOverrides): Promise<BigNumber>;

  getBorrowRate(
    cash: BigNumberish,
    borrows: BigNumberish,
    reserves: BigNumberish,
    badDebt: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  getSupplyRate(
    cash: BigNumberish,
    borrows: BigNumberish,
    reserves: BigNumberish,
    reserveFactorMantissa: BigNumberish,
    badDebt: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  isInterestRateModel(overrides?: CallOverrides): Promise<boolean>;

  jumpMultiplierPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

  kink(overrides?: CallOverrides): Promise<BigNumber>;

  multiplierPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

  updateJumpRateModel(
    baseRatePerYear: BigNumberish,
    multiplierPerYear: BigNumberish,
    jumpMultiplierPerYear: BigNumberish,
    kink_: BigNumberish,
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  utilizationRate(
    cash: BigNumberish,
    borrows: BigNumberish,
    reserves: BigNumberish,
    badDebt: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  callStatic: {
    accessControlManager(overrides?: CallOverrides): Promise<string>;

    baseRatePerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    getBorrowRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getSupplyRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      reserveFactorMantissa: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    isInterestRateModel(overrides?: CallOverrides): Promise<boolean>;

    jumpMultiplierPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    kink(overrides?: CallOverrides): Promise<BigNumber>;

    multiplierPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    updateJumpRateModel(
      baseRatePerYear: BigNumberish,
      multiplierPerYear: BigNumberish,
      jumpMultiplierPerYear: BigNumberish,
      kink_: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    utilizationRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  filters: {
    'NewInterestParams(uint256,uint256,uint256,uint256)'(
      baseRatePerBlock?: null,
      multiplierPerBlock?: null,
      jumpMultiplierPerBlock?: null,
      kink?: null,
    ): NewInterestParamsEventFilter;
    NewInterestParams(
      baseRatePerBlock?: null,
      multiplierPerBlock?: null,
      jumpMultiplierPerBlock?: null,
      kink?: null,
    ): NewInterestParamsEventFilter;
  };

  estimateGas: {
    accessControlManager(overrides?: CallOverrides): Promise<BigNumber>;

    baseRatePerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    getBorrowRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getSupplyRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      reserveFactorMantissa: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    isInterestRateModel(overrides?: CallOverrides): Promise<BigNumber>;

    jumpMultiplierPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    kink(overrides?: CallOverrides): Promise<BigNumber>;

    multiplierPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    updateJumpRateModel(
      baseRatePerYear: BigNumberish,
      multiplierPerYear: BigNumberish,
      jumpMultiplierPerYear: BigNumberish,
      kink_: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    utilizationRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    accessControlManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    baseRatePerBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getBorrowRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getSupplyRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      reserveFactorMantissa: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    isInterestRateModel(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    jumpMultiplierPerBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    kink(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    multiplierPerBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    updateJumpRateModel(
      baseRatePerYear: BigNumberish,
      multiplierPerYear: BigNumberish,
      jumpMultiplierPerYear: BigNumberish,
      kink_: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    utilizationRate(
      cash: BigNumberish,
      borrows: BigNumberish,
      reserves: BigNumberish,
      badDebt: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
