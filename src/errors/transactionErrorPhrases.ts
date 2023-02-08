import { t } from 'translation';

import {
  ComptrollerErrorReporterError,
  ComptrollerErrorReporterFailureInfo,
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
  VaiControllerErrorReporterError,
  VaiControllerErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';

export const transactionErrorPhrases: Record<
  | keyof typeof ComptrollerErrorReporterError
  | keyof typeof ComptrollerErrorReporterFailureInfo
  | keyof typeof TokenErrorReporterError
  | keyof typeof TokenErrorReporterFailureInfo
  | keyof typeof VaiControllerErrorReporterError
  | keyof typeof VaiControllerErrorReporterFailureInfo,
  string
> = {
  NO_ERROR: t('transactionErrors.noError'),
  UNAUTHORIZED: t('transactionErrors.unauthorized'),
  COMPTROLLER_MISMATCH: t('transactionErrors.comptrollerMismatch'),
  INSUFFICIENT_SHORTFALL: t('transactionErrors.insufficientShortfall'),
  INSUFFICIENT_LIQUIDITY: t('transactionErrors.insufficientLiquidity'),
  INVALID_CLOSE_FACTOR: t('transactionErrors.invalidCloseFactor'),
  INVALID_COLLATERAL_FACTOR: t('transactionErrors.invalidCollateralFactor'),
  INVALID_LIQUIDATION_INCENTIVE: t('transactionErrors.invalidLiquidationIncentive'),
  MARKET_NOT_ENTERED: t('transactionErrors.marketNotEntered'),
  MARKET_NOT_LISTED: t('transactionErrors.marketNotListed'),
  MARKET_ALREADY_LISTED: t('transactionErrors.marketAlreadyListed'),
  MATH_ERROR: t('transactionErrors.mathError'),
  NONZERO_BORROW_BALANCE: t('transactionErrors.nonzeroBorrowBalance'),
  PRICE_ERROR: t('transactionErrors.priceError'),
  REJECTION: t('transactionErrors.rejection'),
  SNAPSHOT_ERROR: t('transactionErrors.snapshotError'),
  TOO_MANY_ASSETS: t('transactionErrors.tooManyAssets'),
  TOO_MUCH_REPAY: t('transactionErrors.tooMuchRepay'),
  INSUFFICIENT_BALANCE_FOR_VAI: t('transactionErrors.insufficientBalanceForVai'),
  ACCEPT_ADMIN_PENDING_ADMIN_CHECK: t('transactionErrors.acceptAdminPendingAdminCheck'),
  ACCEPT_PENDING_IMPLEMENTATION_ADDRESS_CHECK: t(
    'transactionErrors.acceptPendingImplementationAddressCheck',
  ),
  EXIT_MARKET_BALANCE_OWED: t('transactionErrors.exitMarketBalanceOwed'),
  EXIT_MARKET_REJECTION: t('transactionErrors.exitMarketRejection'),
  SET_CLOSE_FACTOR_OWNER_CHECK: t('transactionErrors.setCloseFactorOwnerCheck'),
  SET_CLOSE_FACTOR_VALIDATION: t('transactionErrors.setCloseFactorValidation'),
  SET_COLLATERAL_FACTOR_OWNER_CHECK: t('transactionErrors.setCollateralFactorOwnerCheck'),
  SET_COLLATERAL_FACTOR_NO_EXISTS: t('transactionErrors.setCollateralFactorNoExists'),
  SET_COLLATERAL_FACTOR_VALIDATION: t('transactionErrors.setCollateralFactorValidation'),
  SET_COLLATERAL_FACTOR_WITHOUT_PRICE: t('transactionErrors.setCollateralFactorWithoutPrice'),
  SET_IMPLEMENTATION_OWNER_CHECK: t('transactionErrors.setImplementationOwnerCheck'),
  SET_LIQUIDATION_INCENTIVE_OWNER_CHECK: t('transactionErrors.setLiquidationIncentiveOwnerCheck'),
  SET_LIQUIDATION_INCENTIVE_VALIDATION: t('transactionErrors.setLiquidationIncentiveValidation'),
  SET_MAX_ASSETS_OWNER_CHECK: t('transactionErrors.setMaxAssetsOwnerCheck'),
  SET_PENDING_ADMIN_OWNER_CHECK: t('transactionErrors.setPendingAdminOwnerCheck'),
  SET_PENDING_IMPLEMENTATION_OWNER_CHECK: t('transactionErrors.setPendingImplementationOwnerCheck'),
  SET_PRICE_ORACLE_OWNER_CHECK: t('transactionErrors.setPriceOracleOwnerCheck'),
  SUPPORT_MARKET_EXISTS: t('transactionErrors.supportMarketExists'),
  SUPPORT_MARKET_OWNER_CHECK: t('transactionErrors.supportMarketOwnerCheck'),
  SET_PAUSE_GUARDIAN_OWNER_CHECK: t('transactionErrors.setPauseGuardianOwnerCheck'),
  SET_VAI_MINT_RATE_CHECK: t('transactionErrors.setVaiMintRateCheck'),
  SET_VAICONTROLLER_OWNER_CHECK: t('transactionErrors.setVaiControllerOwnerCheck'),
  SET_MINTED_VAI_REJECTION: t('transactionErrors.setMintedVaiRejection'),
  SET_TREASURY_OWNER_CHECK: t('transactionErrors.setTreasuryOwnerCheck'),
  BAD_INPUT: t('transactionErrors.badInput'),
  COMPTROLLER_REJECTION: t('transactionErrors.comptrollerRejection'),
  COMPTROLLER_CALCULATION_ERROR: t('transactionErrors.comptrollerCalculationError'),
  INTEREST_RATE_MODEL_ERROR: t('transactionErrors.interestRateModelError'),
  INVALID_ACCOUNT_PAIR: t('transactionErrors.invalidAccountPair'),
  INVALID_CLOSE_AMOUNT_REQUESTED: t('transactionErrors.invalidCloseAmountRequested'),
  MARKET_NOT_FRESH: t('transactionErrors.marketNotFresh'),
  TOKEN_INSUFFICIENT_ALLOWANCE: t('transactionErrors.tokenInsufficientAllowance'),
  TOKEN_INSUFFICIENT_BALANCE: t('transactionErrors.tokenInsufficientBalance'),
  TOKEN_INSUFFICIENT_CASH: t('transactionErrors.tokenInsufficentCash'),
  TOKEN_TRANSFER_IN_FAILED: t('transactionErrors.tokenTransferInFailed'),
  TOKEN_TRANSFER_OUT_FAILED: t('transactionErrors.tokenTransferOutFailed'),
  TOKEN_PRICE_ERROR: t('transactionErrors.tokenPriceError'),
  ACCRUE_INTEREST_ACCUMULATED_INTEREST_CALCULATION_FAILED: t(
    'transactionErrors.accrueInterestAccumulatedInterestCalculationFailed',
  ),
  ACCRUE_INTEREST_BORROW_RATE_CALCULATION_FAILED: t(
    'transactionErrors.accrueInterestBorrowRateCalculationFailed',
  ),
  ACCRUE_INTEREST_NEW_BORROW_INDEX_CALCULATION_FAILED: t(
    'transactionErrors.accrueInterestNewBorrowIndexCalculationFailed',
  ),
  ACCRUE_INTEREST_NEW_TOTAL_BORROWS_CALCULATION_FAILED: t(
    'transactionErrors.accrueInterestNewTotalBorrowsCalculationFailed',
  ),
  ACCRUE_INTEREST_NEW_TOTAL_RESERVES_CALCULATION_FAILED: t(
    'transactionErrors.accrueInterestNewTotalReservesCalculationFailed',
  ),
  ACCRUE_INTEREST_SIMPLE_INTEREST_FACTOR_CALCULATION_FAILED: t(
    'transactionErrors.accrueInterestSimpleInterestFactorCalculationFailed',
  ),
  BORROW_ACCUMULATED_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.borrowAccumulatedBalanceCalculationFailed',
  ),
  BORROW_ACCRUE_INTEREST_FAILED: t('transactionErrors.borrowAccrueInterestFailed'),
  BORROW_CASH_NOT_AVAILABLE: t('transactionErrors.borrowCashNotAvailable'),
  BORROW_FRESHNESS_CHECK: t('transactionErrors.borrowFreshnessCheck'),
  BORROW_NEW_TOTAL_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.borrowNewTotalBalanceCalculationFailed',
  ),
  BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.borrowNewAccountBorrowBalanceCalculationFailed',
  ),
  BORROW_MARKET_NOT_LISTED: t('transactionErrors.borrowMarketNotListed'),
  BORROW_COMPTROLLER_REJECTION: t('transactionErrors.borrowComptrollerRejection'),
  LIQUIDATE_ACCRUE_BORROW_INTEREST_FAILED: t(
    'transactionErrors.liquidateAccrueBorrowInterestFailed',
  ),
  LIQUIDATE_ACCRUE_COLLATERAL_INTEREST_FAILED: t(
    'transactionErrors.liquidateAccrueCollateralInterestFailed',
  ),
  LIQUIDATE_COLLATERAL_FRESHNESS_CHECK: t('transactionErrors.liquidateCollateralFreshnessCheck'),
  LIQUIDATE_COMPTROLLER_REJECTION: t('transactionErrors.liquidateComptrollerRejection'),
  LIQUIDATE_COMPTROLLER_CALCULATE_AMOUNT_SEIZE_FAILED: t(
    'transactionErrors.liquidateComptrollerCalculateAmountSeizeFailed',
  ),
  LIQUIDATE_CLOSE_AMOUNT_IS_UINT_MAX: t('transactionErrors.liquidateCloseAmountIsUintMax'),
  LIQUIDATE_CLOSE_AMOUNT_IS_ZERO: t('transactionErrors.liquidateCloseAmountIsZero'),
  LIQUIDATE_FRESHNESS_CHECK: t('transactionErrors.liquidateFreshnessCheck'),
  LIQUIDATE_LIQUIDATOR_IS_BORROWER: t('transactionErrors.liquidateSeizeIsBorrower'),
  LIQUIDATE_REPAY_BORROW_FRESH_FAILED: t('transactionErrors.liquidateSeizeBorrowFreshFailed'),
  LIQUIDATE_SEIZE_BALANCE_INCREMENT_FAILED: t(
    'transactionErrors.liquidateSeizeBalanceIncrementFailed',
  ),
  LIQUIDATE_SEIZE_BALANCE_DECREMENT_FAILED: t(
    'transactionErrors.liquidateSeizeBalanceDecrementFailed',
  ),
  LIQUIDATE_SEIZE_COMPTROLLER_REJECTION: t('transactionErrors.liquidateSeizeComptrollerRejection'),
  LIQUIDATE_SEIZE_LIQUIDATOR_IS_BORROWER: t('transactionErrors.liquidateSeizeLiquidatorIsBorrower'),
  LIQUIDATE_SEIZE_TOO_MUCH: t('transactionErrors.liquidateSeizeTooMuch'),
  MINT_ACCRUE_INTEREST_FAILED: t('transactionErrors.mintAccrueInterestFailed'),
  MINT_COMPTROLLER_REJECTION: t('transactionErrors.mintComptrollerRejection'),
  MINT_EXCHANGE_CALCULATION_FAILED: t('transactionErrors.mintExchangeRateReadFailed'),
  MINT_EXCHANGE_RATE_READ_FAILED: t('transactionErrors.mintExchangeRateReadFailed'),
  MINT_FRESHNESS_CHECK: t('transactionErrors.mintFreshnessCheck'),
  MINT_NEW_ACCOUNT_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.mintNewAccountBalanceCalculationFailed',
  ),
  MINT_NEW_TOTAL_SUPPLY_CALCULATION_FAILED: t(
    'transactionErrors.mintNewTotalSupplyCalculationFailed',
  ),
  MINT_TRANSFER_IN_FAILED: t('transactionErrors.mintTransferInFailed'),
  MINT_TRANSFER_IN_NOT_POSSIBLE: t('transactionErrors.mintTransferNotPossible'),
  REDEEM_ACCRUE_INTEREST_FAILED: t('transactionErrors.redeemAccrueInterestFailed'),
  REDEEM_COMPTROLLER_REJECTION: t('transactionErrors.redeemComptrollerRejection'),
  REDEEM_EXCHANGE_TOKENS_CALCULATION_FAILED: t(
    'transactionErrors.redeemExchangeTokensCalculationFailed',
  ),
  REDEEM_EXCHANGE_AMOUNT_CALCULATION_FAILED: t(
    'transactionErrors.redeemExchangeAmountCalculatioFailed',
  ),
  REDEEM_EXCHANGE_RATE_READ_FAILED: t('transactionErrors.redeemExchangeRateReadFailed'),
  REDEEM_FRESHNESS_CHECK: t('transactionErrors.redeemFreshnessCheck'),
  REDEEM_NEW_ACCOUNT_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.redeemNewAccountBalanceCalculationFailed',
  ),
  REDEEM_NEW_TOTAL_SUPPLY_CALCULATION_FAILED: t(
    'transactionErrors.redeemNewTotalSupplyCalculationFailed',
  ),
  REDEEM_TRANSFER_OUT_NOT_POSSIBLE: t('transactionErrors.redeemTransferOutNotPossible'),
  REDUCE_RESERVES_ACCRUE_INTEREST_FAILED: t('transactionErrors.reduceReservesAccrueInterestFailed'),
  REDUCE_RESERVES_ADMIN_CHECK: t('transactionErrors.reduceReservesAdminCheck'),
  REDUCE_RESERVES_CASH_NOT_AVAILABLE: t('transactionErrors.reduceReservesCashNotAvailable'),
  REDUCE_RESERVES_FRESH_CHECK: t('transactionErrors.reduceReservesFreshCheck'),
  REDUCE_RESERVES_VALIDATION: t('transactionErrors.reduceReservesValidation'),
  REPAY_BEHALF_ACCRUE_INTEREST_FAILED: t('transactionErrors.repayBehalfAccrueInterestFailed'),
  REPAY_BORROW_ACCRUE_INTEREST_FAILED: t('transactionErrors.repayBorrowAccrueInterestFailed'),
  REPAY_BORROW_ACCUMULATED_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.repayBorrowAccumulatedBalanceCalculationFailed',
  ),
  REPAY_BORROW_COMPTROLLER_REJECTION: t('transactionErrors.repayBorrowComptrollerRejection'),
  REPAY_BORROW_FRESHNESS_CHECK: t('transactionErrors.repayBorrowFreshnessCheck'),
  REPAY_BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.repayBorrowNewAccountBorrowBalanceCalculationFailed',
  ),
  REPAY_BORROW_NEW_TOTAL_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.repayBorrowTransferNotPossible',
  ),
  REPAY_BORROW_TRANSFER_IN_NOT_POSSIBLE: t('transactionErrors.repayBorrowTransferInNotPossible'),
  SET_COMPTROLLER_OWNER_CHECK: t('transactionErrors.setComptrollerOwnerCheck'),
  SET_INTEREST_RATE_MODEL_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.setInterestRateModelAccrueInterestFailed',
  ),
  SET_INTEREST_RATE_MODEL_FRESH_CHECK: t('transactionErrors.setInterestRateModelFreshCheck'),
  SET_INTEREST_RATE_MODEL_OWNER_CHECK: t('transactionErrors.setInterestRateModelOwnerCheck'),
  SET_ORACLE_MARKET_NOT_LISTED: t('transactionErrors.setOracleMarketNotListed'),
  SET_RESERVE_FACTOR_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.setReserveFactorAccrueInterestFailed',
  ),
  SET_RESERVE_FACTOR_ADMIN_CHECK: t('transactionErrors.setReserveFactorAdminCheck'),
  SET_RESERVE_FACTOR_FRESH_CHECK: t('transactionErrors.setReserveFactorFreshCheck'),
  SET_RESERVE_FACTOR_BOUNDS_CHECK: t('transactionErrors.setReserveFactorBoundsCheck'),
  TRANSFER_COMPTROLLER_REJECTION: t('transactionErrors.transferComptrollerRejection'),
  TRANSFER_NOT_ALLOWED: t('transactionErrors.transferNotAllowed'),
  TRANSFER_NOT_ENOUGH: t('transactionErrors.transferNotEnough'),
  TRANSFER_TOO_MUCH: t('transactionErrors.transferTooMuch'),
  ADD_RESERVES_ACCRUE_INTEREST_FAILED: t('transactionErrors.addReservesAccrueInterestFailed'),
  ADD_RESERVES_FRESH_CHECK: t('transactionErrors.addReservesFreshCheck'),
  ADD_RESERVES_TRANSFER_IN_NOT_POSSIBLE: t('transactionErrors.addReservesTransferInNotPossible'),
  TOKEN_GET_UNDERLYING_PRICE_ERROR: t('transactionErrors.tokenGetUnderlyingPriceError'),
  REPAY_VAI_COMPTROLLER_REJECTION: t('transactionErrors.repayVaiComptrollerRejection'),
  REPAY_VAI_FRESHNESS_CHECK: t('transactionErrors.repayVaiFreshnessCheck'),
  VAI_MINT_EXCHANGE_CALCULATION_FAILED: t('transactionErrors.vaiMintExchangeCalculationFailed'),
  SFT_MINT_NEW_ACCOUNT_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.sftMintNewAccountBalanceCalculationFailed',
  ),
  REDEEM_FEE_CALCULATION_FAILED: t('transactionErrors.redeemFeeCalculationFailed'),
  VAI_MINT_REJECTION: t('transactionErrors.vaiMintRejection'),
  VAI_BURN_REJECTION: t('transactionErrors.vaiBurnRejection'),
  VAI_LIQUIDATE_ACCRUE_BORROW_INTEREST_FAILED: t(
    'transactionErrors.vaiLiquidateAccrueBorrowInterestFailed',
  ),
  VAI_LIQUIDATE_ACCRUE_COLLATERAL_INTEREST_FAILED: t(
    'transactionErrors.vaiLiquidateAccrueCollateralInterestFailed',
  ),
  VAI_LIQUIDATE_COLLATERAL_FRESHNESS_CHECK: t(
    'transactionErrors.vaiLiquidateCollateralFreshnessCheck',
  ),
  VAI_LIQUIDATE_COMPTROLLER_REJECTION: t('transactionErrors.vaiLiquidateComptrollerRejection'),
  VAI_LIQUIDATE_COMPTROLLER_CALCULATE_AMOUNT_SEIZE_FAILED: t(
    'transactionErrors.vaiLiquidateComptrollerCalculateAmountSeizeFailed',
  ),
  VAI_LIQUIDATE_CLOSE_AMOUNT_IS_UINT_MAX: t('transactionErrors.vaiLiquidateCloseAmountIsUintMax'),
  VAI_LIQUIDATE_CLOSE_AMOUNT_IS_ZERO: t('transactionErrors.vaiLiquidateCloseAmountIsZero'),
  VAI_LIQUIDATE_FRESHNESS_CHECK: t('transactionErrors.vaiLiquidateFreshnessCheck'),
  VAI_LIQUIDATE_LIQUIDATOR_IS_BORROWER: t('transactionErrors.vaiLiquidateLiquidatorIsBorrower'),
  VAI_LIQUIDATE_REPAY_BORROW_FRESH_FAILED: t(
    'transactionErrors.vaiLiquidateRepayBorrowFreshFailed',
  ),
  VAI_LIQUIDATE_SEIZE_BALANCE_INCREMENT_FAILED: t(
    'transactionErrors.vaiLiquidateSeizeBalanceIncrementFailed',
  ),
  VAI_LIQUIDATE_SEIZE_BALANCE_DECREMENT_FAILED: t(
    'transactionErrors.vaiLiquidateSeizeBalanceDecrementFailed',
  ),
  VAI_LIQUIDATE_SEIZE_COMPTROLLER_REJECTION: t(
    'transactionErrors.vaiLiquidateSeizeComptrollerRejection',
  ),
  VAI_LIQUIDATE_SEIZE_LIQUIDATOR_IS_BORROWER: t(
    'transactionErrors.vaiLiquidateSeizeLiquidatorIsBorrower',
  ),
  VAI_LIQUIDATE_SEIZE_TOO_MUCH: t('transactionErrors.vaiLiquidateSeizeTooMuch'),
  MINT_FEE_CALCULATION_FAILED: t('transactionErrors.mintFeeCalculationFailed'),
};
